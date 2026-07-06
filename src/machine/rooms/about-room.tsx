import { useRef } from 'react'
import { Mesh, MeshStandardMaterial, PointLight } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { PROFILE } from '../../data/profile'
import { useMachine } from '../../state/store'
import { ROOMS } from '../layout'
import { HoloPanel } from '../components/holo-panel'
import { FONT_BOLD } from '../fonts'

/** the machine's CPU — a slowly pulsing core anchoring the chamber */
function Core() {
  const [cx, cz] = ROOMS.about.center
  const mesh = useRef<Mesh>(null)
  const light = useRef<PointLight>(null)
  const reducedMotion = useMachine((s) => s.reducedMotion)

  useFrame((state, delta) => {
    if (!mesh.current || !light.current) return
    const t = state.clock.elapsedTime
    const pulse = reducedMotion ? 0.5 : 0.5 + Math.sin(t * 1.4) * 0.25 + Math.sin(t * 3.7) * 0.06
    const mat = mesh.current.material as MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + pulse
    light.current.intensity = 14 + pulse * 14
    if (!reducedMotion) {
      mesh.current.rotation.y += delta * 0.25
      mesh.current.rotation.x += delta * 0.07
    }
  })

  return (
    <group position={[cx, 1.45, cz]}>
      {/* plinth */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.8, 8]} />
        <meshStandardMaterial color="#0a1017" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#062015"
          metalness={0.4}
          roughness={0.2}
          emissive="#39ff9c"
          emissiveIntensity={1}
          flatShading
        />
      </mesh>
      {/* containment ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.95, 0.03, 8, 48]} />
        <meshStandardMaterial color="#0d1620" metalness={0.9} roughness={0.2} emissive="#39ff9c" emissiveIntensity={0.35} />
      </mesh>
      <pointLight ref={light} color="#39ff9c" intensity={20} distance={13} decay={1.8} />
    </group>
  )
}

export function AboutRoom() {
  const room = ROOMS.about
  const [cx, cz] = room.center
  const currentRoom = useMachine((s) => s.currentRoom)
  const apothem = room.size[0] / 2 - 0.55

  // wall azimuths for the three display panels (door faces +z / azimuth 0)
  const panelAngles = [Math.PI * 0.75, Math.PI, Math.PI * 1.25]

  return (
    <group>
      <Text
        font={FONT_BOLD}
        fontSize={0.42}
        color="#39ff9c"
        anchorX="center"
        position={[cx + apothem * Math.sin(Math.PI * 0.5) - 0.4, 2.55, cz]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        /about — CORE
      </Text>

      <Core />

      {/* holographic wall displays mount only while the visitor is inside —
          drei Html renders above the canvas, so hide it from other rooms */}
      {currentRoom === 'about' && (
        <group>
          <HoloPanel
            position={[
              cx + apothem * Math.sin(panelAngles[0]),
              1.75,
              cz + apothem * Math.cos(panelAngles[0]),
            ]}
            rotationY={panelAngles[0] + Math.PI}
            accent="#39ff9c"
            delayMs={80}
          >
            <h3 className="text-lg tracking-[0.3em] text-[#39ff9c]">IDENTITY.SYS</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#c7d6dd]">{PROFILE.bio[0]}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5b7482]">{PROFILE.bio[1]}</p>
          </HoloPanel>

          <HoloPanel
            position={[
              cx + apothem * Math.sin(panelAngles[1]),
              1.75,
              cz + apothem * Math.cos(panelAngles[1]),
            ]}
            rotationY={panelAngles[1] + Math.PI}
            accent="#4da6ff"
            delayMs={220}
          >
            <h3 className="text-lg tracking-[0.3em] text-[#4da6ff]">TRAJECTORY.LOG</h3>
            <div className="mt-4 space-y-4">
              {PROFILE.narrative.map((block) => (
                <div key={block.title}>
                  <p className="text-[13px] tracking-[0.25em] text-[#4da6ff]">▸ {block.title}</p>
                  <p className="mt-1 text-[14px] leading-snug text-[#c7d6dd]/85">{block.body}</p>
                </div>
              ))}
            </div>
          </HoloPanel>

          <HoloPanel
            position={[
              cx + apothem * Math.sin(panelAngles[2]),
              1.75,
              cz + apothem * Math.cos(panelAngles[2]),
            ]}
            rotationY={panelAngles[2] + Math.PI}
            accent="#39ff9c"
            delayMs={360}
          >
            <h3 className="text-lg tracking-[0.3em] text-[#39ff9c]">TIMELINE.DAT</h3>
            <ol className="mt-4 space-y-3">
              {PROFILE.timeline.map((entry) => (
                <li key={entry.period + entry.title} className="border-l border-[#39ff9c]/40 pl-4">
                  <p className="text-[12px] tracking-widest text-[#39ff9c]">{entry.period}</p>
                  <p className="text-[14px] text-[#c7d6dd]">
                    {entry.title} · <span className="text-[#5b7482]">{entry.org}</span>
                  </p>
                </li>
              ))}
            </ol>
          </HoloPanel>
        </group>
      )}
    </group>
  )
}
