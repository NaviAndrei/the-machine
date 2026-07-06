import { useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { Grid, Text } from '@react-three/drei'
import { useMachine } from '../state/store'
import { CORRIDORS, ROOMS } from './layout'
import { matDark } from './materials'
import { Corridor, OctagonRoomShell, RectRoomShell } from './rooms/room-shell'
import { AboutRoom } from './rooms/about-room'
import { ProjectsRoom } from './rooms/projects-room'
import { SkillsRoom } from './rooms/skills-room'
import { ContactRoom } from './rooms/contact-room'
import { Waypoints } from './waypoints'
import './shaders/crt-material'
import { FONT, FONT_BOLD } from './fonts'

/** spawn chamber: signage + directions */
function FrontBus() {
  const screenMat = useRef<ShaderMaterial & { uTime: number }>(null)
  const reducedMotion = useMachine((s) => s.reducedMotion)

  useFrame((state) => {
    if (screenMat.current && !reducedMotion) screenMat.current.uTime = state.clock.elapsedTime
  })

  const signs: { room: keyof typeof ROOMS; pos: [number, number, number]; rotY: number }[] = [
    { room: 'about', pos: [-1.9, 2.2, -4.6], rotY: 0 },
    { room: 'contact', pos: [1.9, 2.2, 4.6], rotY: Math.PI },
    { room: 'skills', pos: [-4.6, 2.2, 1.9], rotY: Math.PI / 2 },
    { room: 'projects', pos: [4.6, 2.2, -1.9], rotY: -Math.PI / 2 },
  ]

  return (
    <group>
      {/* master status display above the /about door */}
      <group position={[0, 3.3, -4.82]}>
        <mesh>
          <boxGeometry args={[4.6, 1.5, 0.12]} />
          <meshStandardMaterial color="#0d1620" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[4.4, 1.3]} />
          <crtScreenMaterial ref={screenMat} />
        </mesh>
        <Text font={FONT_BOLD} fontSize={0.42} color="#c7f5df" anchorX="center" position={[0, 0.18, 0.08]}>
          THE MACHINE
        </Text>
        <Text font={FONT} fontSize={0.13} color="#9adfc0" anchorX="center" position={[0, -0.28, 0.08]}>
          IVAN ANDREI — INTERNAL ARCHITECTURE v0.1.0
        </Text>
      </group>

      {/* door signs */}
      {signs.map((sign) => (
        <group key={sign.room} position={sign.pos} rotation={[0, sign.rotY, 0]}>
          <Text font={FONT} fontSize={0.19} color={ROOMS[sign.room].accent} anchorX="center">
            {ROOMS[sign.room].path}
          </Text>
          <Text font={FONT} fontSize={0.09} color="#5b7482" anchorX="center" position={[0, -0.22, 0]}>
            {ROOMS[sign.room].label}
          </Text>
        </group>
      ))}

      {/* floor arrows toward each corridor */}
      {signs.map((sign) => {
        const def = ROOMS[sign.room]
        const dir = [Math.sign(def.center[0]), Math.sign(def.center[1])]
        return (
          <Text
            key={`floor-${sign.room}`}
            font={FONT}
            fontSize={0.24}
            color={def.accent}
            anchorX="center"
            position={[dir[0] * 3.4, 0.08, dir[1] * 3.4]}
            rotation={[-Math.PI / 2, 0, Math.atan2(dir[0], dir[1]) + Math.PI]}
          >
            {`▲ ${def.path}`}
          </Text>
        )
      })}
    </group>
  )
}

export function World() {
  return (
    <group>
      <fog attach="fog" args={['#05080a', 14, 60]} />
      <ambientLight intensity={0.35} color="#8fb6c9" />

      {/* base floor under everything */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} material={matDark}>
        <planeGeometry args={[140, 120]} />
      </mesh>
      <Grid
        position={[3, 0.005, -3]}
        args={[140, 120]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#0d2233"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#123847"
        fadeDistance={42}
        fadeStrength={1.4}
      />

      {/* architecture */}
      <RectRoomShell room={ROOMS.bus} doors={['north', 'south', 'east', 'west']} />
      <OctagonRoomShell room={ROOMS.about} />
      <RectRoomShell room={ROOMS.skills} doors={['east']} />
      <RectRoomShell room={ROOMS.projects} doors={['west']} />
      <RectRoomShell room={ROOMS.contact} doors={['north']} />
      {CORRIDORS.map((corridor) => (
        <Corridor key={corridor.room} corridor={corridor} accent={ROOMS[corridor.room].accent} />
      ))}

      {/* room interiors */}
      <FrontBus />
      <AboutRoom />
      <SkillsRoom />
      <ProjectsRoom />
      <ContactRoom />

      <Waypoints />
    </group>
  )
}
