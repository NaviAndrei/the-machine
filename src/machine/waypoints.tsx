import { useRef } from 'react'
import { Group, MeshBasicMaterial, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html, Text } from '@react-three/drei'
import { playerState, useMachine, type RoomId } from '../state/store'
import { ROOMS, ROOM_ORDER } from './layout'
import { FONT } from './fonts'

function Beacon({ room }: { room: RoomId }) {
  const def = ROOMS[room]
  const requestTravel = useMachine((s) => s.requestTravel)
  const reducedMotion = useMachine((s) => s.reducedMotion)
  const ring = useRef<Group>(null)
  const hovered = useRef(false)
  const ringMat = useRef<MeshBasicMaterial>(null)
  const beamMat = useRef<MeshBasicMaterial>(null)
  const phase = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!ring.current || !ringMat.current || !beamMat.current) return
    if (!reducedMotion) phase.current += delta * 2.2
    // the marker melts away as the visitor closes in — never blocks the view
    const dist = Math.hypot(playerState.x - def.waypoint[0], playerState.z - def.waypoint[1])
    const near = Math.min(1, Math.max(0, (dist - 1.6) / 2.4))
    const parent = ring.current.parent?.parent
    if (parent) parent.visible = near > 0.02
    const pulse = 1 + Math.sin(phase.current) * 0.08
    const bright = hovered.current ? 1.9 : 1
    ring.current.scale.setScalar(pulse * (hovered.current ? 1.15 : 1))
    ringMat.current.color.set(def.accent).multiplyScalar(bright * 1.8)
    ringMat.current.opacity = near
    beamMat.current.opacity = ((hovered.current ? 0.28 : 0.14) + Math.sin(phase.current) * 0.03) * near
    void state
  })

  return (
    <group
      position={[def.waypoint[0], 0, def.waypoint[1]]}
      onClick={(event) => {
        event.stopPropagation()
        requestTravel(room)
      }}
      onPointerOver={() => {
        hovered.current = true
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        hovered.current = false
        document.body.style.cursor = ''
      }}
    >
      <group ref={ring}>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.035, 8, 40]} />
          <meshBasicMaterial ref={ringMat} color={new Color(def.accent)} transparent />
        </mesh>
      </group>
      {/* light column */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 2.8, 12, 1, true]} />
        <meshBasicMaterial
          ref={beamMat}
          color={new Color(def.accent)}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
      <Billboard position={[0, 2.15, 0]}>
        <Text font={FONT} fontSize={0.24} color={def.accent} anchorX="center" anchorY="middle">
          {def.path}
        </Text>
        <Text font={FONT} fontSize={0.11} color="#5b7482" anchorX="center" anchorY="middle" position={[0, -0.24, 0]}>
          {def.label} — CLICK TO TRAVEL
        </Text>
      </Billboard>
      {/* real anchor for keyboard / screen-reader travel, mirrors console-link.tsx's pattern */}
      <Html position={[0, 2.15, 0]} center zIndexRange={[10, 0]} occlude={false}>
        <button
          type="button"
          onClick={() => requestTravel(room)}
          className="holo-in whitespace-nowrap border border-current/40 bg-void/90 px-2 py-1 font-mono text-[10px] tracking-widest opacity-0 focus:opacity-100"
          style={{ color: def.accent }}
        >
          TRAVEL TO {def.path} — {def.label}
        </button>
      </Html>
      {/* generous invisible hit target */}
      <mesh position={[0, 1.2, 0]} visible={false}>
        <cylinderGeometry args={[0.8, 0.8, 2.6, 8]} />
      </mesh>
    </group>
  )
}

export function Waypoints() {
  return (
    <group>
      {ROOM_ORDER.map((room) => (
        <Beacon key={room} room={room} />
      ))}
    </group>
  )
}
