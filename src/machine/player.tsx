import { useEffect, useMemo, useRef } from 'react'
import { Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { playerState, useMachine, type RoomId } from '../state/store'
import { clampToZones, rectContains } from '../lib/walkable'
import { updateHash, roomFromHash } from '../lib/use-hash-sync'
import { corridorMid, EYE_HEIGHT, ROOMS, ROOM_RECTS, WALKABLE_ZONES } from './layout'

const MOVE_SPEED = 5.4
const TURN_SPEED = 2.1
const TRAVEL_SPEED = 8.5
const DRAG_SENSITIVITY = 0.0045
const TOUCH_DRAG_SENSITIVITY = 0.0075

export type ControlName = 'forward' | 'backward' | 'left' | 'right' | 'turnLeft' | 'turnRight'

interface Travel {
  room: RoomId
  path: Vector3[]
  segment: number
  finalYaw: number
}

const roomAt = (x: number, z: number): RoomId | null =>
  ROOM_RECTS.find(({ rect }) => rectContains(rect, x, z))?.id ?? null

/** route through the hub — every room connects to it */
function buildTravel(from: Vector3, target: RoomId): Travel {
  const here = roomAt(from.x, from.z) ?? 'bus'
  const path: Vector3[] = []
  const push = (x: number, z: number) => path.push(new Vector3(x, 0, z))

  if (here !== target) {
    if (here !== 'bus') {
      const [mx, mz] = corridorMid(here)
      push(mx, mz)
    }
    if (target !== 'bus') {
      if (here !== 'bus') push(0, 0)
      const [mx, mz] = corridorMid(target)
      push(mx, mz)
    }
  }
  const [wx, wz] = ROOMS[target].waypoint
  push(wx, wz)
  return { room: target, path, segment: 0, finalYaw: ROOMS[target].waypointYaw }
}

const angleDiff = (from: number, to: number): number => {
  let diff = (to - from) % (Math.PI * 2)
  if (diff > Math.PI) diff -= Math.PI * 2
  if (diff < -Math.PI) diff += Math.PI * 2
  return diff
}

const dampAngle = (current: number, target: number, lambda: number, delta: number): number =>
  current + angleDiff(current, target) * (1 - Math.exp(-lambda * delta))

export function Player() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const [, getKeys] = useKeyboardControls<ControlName>()

  const spawn = useMemo(() => {
    const room = roomFromHash() ?? 'bus'
    return { pos: ROOMS[room].waypoint, yaw: ROOMS[room].waypointYaw, room }
  }, [])

  const pos = useRef(new Vector3(spawn.pos[0], 0, spawn.pos[1]))
  const yaw = useRef(spawn.yaw)
  const travel = useRef<Travel | null>(null)
  const lastRoom = useRef<RoomId>(spawn.room)
  const bobPhase = useRef(0)

  // sync the store with a deep-linked spawn
  useEffect(() => {
    if (spawn.room !== 'bus') useMachine.getState().setRoom(spawn.room)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // drag-to-look (no pointer lock)
  useEffect(() => {
    const el = gl.domElement
    let dragging = false
    let lastX = 0
    let sensitivity = DRAG_SENSITIVITY
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      lastX = e.clientX
      sensitivity = e.pointerType === 'touch' ? TOUCH_DRAG_SENSITIVITY : DRAG_SENSITIVITY
      el.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      yaw.current -= (e.clientX - lastX) * sensitivity
      lastX = e.clientX
      travel.current = null
    }
    const up = () => {
      dragging = false
      el.style.cursor = ''
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const keys = getKeys()
    const machine = useMachine.getState()

    // waypoint travel requests from beacons / minimap
    if (machine.travelTarget && travel.current?.room !== machine.travelTarget) {
      travel.current = buildTravel(pos.current, machine.travelTarget)
      machine.clearTravel()
    }

    // any manual input cancels autopilot
    if (keys.forward || keys.backward || keys.left || keys.right) travel.current = null

    let moving = false
    if (travel.current) {
      const t = travel.current
      const target = t.path[t.segment]
      const toTarget = new Vector3(target.x - pos.current.x, 0, target.z - pos.current.z)
      const dist = toTarget.length()
      if (dist < 0.15) {
        if (t.segment < t.path.length - 1) {
          t.segment += 1
        } else {
          yaw.current = dampAngle(yaw.current, t.finalYaw, 6, delta)
          if (Math.abs(angleDiff(yaw.current, t.finalYaw)) < 0.02) travel.current = null
        }
      } else {
        const step = Math.min(dist, TRAVEL_SPEED * delta)
        toTarget.normalize()
        pos.current.addScaledVector(toTarget, step)
        yaw.current = dampAngle(yaw.current, Math.atan2(-toTarget.x, -toTarget.z), 5, delta)
        moving = true
      }
    } else {
      if (keys.turnLeft) yaw.current += TURN_SPEED * delta
      if (keys.turnRight) yaw.current -= TURN_SPEED * delta

      const fwd = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0)
      const strafe = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
      if (fwd !== 0 || strafe !== 0) {
        const sin = Math.sin(yaw.current)
        const cos = Math.cos(yaw.current)
        const dir = new Vector3(-sin * fwd + cos * strafe, 0, -cos * fwd - sin * strafe)
        dir.normalize().multiplyScalar(MOVE_SPEED * delta)
        const next = clampToZones(
          WALKABLE_ZONES,
          pos.current.x,
          pos.current.z,
          pos.current.x + dir.x,
          pos.current.z + dir.z,
        )
        moving = next.x !== pos.current.x || next.z !== pos.current.z
        pos.current.set(next.x, 0, next.z)
      }
    }

    // subtle walk bob (skipped for reduced motion)
    if (moving && !machine.reducedMotion) bobPhase.current += delta * 9
    const bob = moving && !machine.reducedMotion ? Math.sin(bobPhase.current) * 0.02 : 0

    camera.rotation.order = 'YXZ'
    camera.position.set(pos.current.x, EYE_HEIGHT + bob, pos.current.z)
    camera.rotation.set(0, yaw.current, 0)

    // room detection → HUD label, glitch burst, url hash
    const room = roomAt(pos.current.x, pos.current.z)
    if (room && room !== lastRoom.current) {
      lastRoom.current = room
      machine.setRoom(room)
      machine.triggerGlitch()
      updateHash(room)
    }

    playerState.x = pos.current.x
    playerState.z = pos.current.z
    playerState.yaw = yaw.current
    void state
  })

  return null
}
