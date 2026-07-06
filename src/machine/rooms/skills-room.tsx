import { useMemo, useRef } from 'react'
import { Group, MathUtils, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { SKILLS } from '../../data/skills'
import { playerState, useMachine } from '../../state/store'
import { ROOMS } from '../layout'
import { CARD_W, ProcessCard, createCardAnim, type CardAnim } from '../components/process-card'
import { FONT_BOLD } from '../fonts'
const TRACK_W = CARD_W - 0.36

interface CardSlot {
  skill: (typeof SKILLS)[number]
  anim: CardAnim
  position: [number, number, number]
  rotationY: number
}

export function SkillsRoom() {
  const room = ROOMS.skills
  const [cx, cz] = room.center
  const reducedMotion = useMachine((s) => s.reducedMotion)
  const refs = useRef<(Group | null)[]>([])

  const slots = useMemo<CardSlot[]>(() => {
    // ring of processes around the room core, gap left at the east door
    const radius = 6.6
    const start = Math.PI * 0.22 // leave the doorway (azimuth ~π/2 toward +x) clear
    const span = Math.PI * 2 - Math.PI * 0.44
    return SKILLS.map((skill, i) => {
      const theta = Math.PI / 2 + start + (span * i) / (SKILLS.length - 1)
      const x = cx + radius * Math.sin(theta)
      const z = cz + radius * Math.cos(theta)
      const baseY = 1.7 + (i % 3) * 0.55
      return {
        skill,
        anim: createCardAnim(skill, i, baseY),
        position: [x, baseY, z] as [number, number, number],
        // face the room center: atan2(center - position) already points inward
        rotationY: Math.atan2(cx - x, cz - z),
      }
    })
  }, [cx, cz])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    slots.forEach((slot, i) => {
      const group = refs.current[i]
      if (!group) return
      const anim = slot.anim

      // gentle float + sway
      if (!reducedMotion) {
        group.position.y = anim.baseY + Math.sin(t * 0.6 + anim.floatPhase) * 0.14
        group.rotation.y = slot.rotationY + Math.sin(t * 0.35 + anim.floatPhase) * 0.05
      }

      // proximity response — brighten and expand as the visitor approaches
      const dx = playerState.x - slot.position[0]
      const dz = playerState.z - slot.position[2]
      const dist = Math.hypot(dx, dz)
      const targetBright = MathUtils.clamp(1 - (dist - 2.2) / 5.5, 0, 1)
      anim.brightness = MathUtils.damp(anim.brightness, targetBright, 5, delta)
      anim.backing.emissiveIntensity = 0.03 + anim.brightness * 0.22
      anim.fillMat.emissiveIntensity = 1.8 + anim.brightness * 1.8
      group.scale.setScalar(1 + anim.brightness * 0.09)

      // proficiency bar eases up when the visitor is near, drains when far (self-directed cards have no bar)
      const targetFill = slot.skill.tier === 'verified' && dist < 8.5 ? slot.skill.proficiency / 100 : 0
      anim.fill = MathUtils.damp(anim.fill, targetFill, 2.4, delta)
      const fill = group.getObjectByName('bar-fill') as Mesh | null
      if (fill) {
        const s = Math.max(0.001, anim.fill)
        fill.scale.x = s
        fill.position.x = -TRACK_W / 2 + (s * TRACK_W) / 2
      }
    })
  })

  return (
    <group>
      {/* room title on the back wall */}
      <Text
        font={FONT_BOLD}
        fontSize={0.6}
        color="#4da6ff"
        anchorX="center"
        position={[cx - room.size[0] / 2 + 0.5, 4.6, cz]}
        rotation={[0, Math.PI / 2, 0]}
      >
        /skills — PROCESS SCHEDULER
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.18}
        color="#5b7482"
        anchorX="center"
        position={[cx - room.size[0] / 2 + 0.5, 4.1, cz]}
        rotation={[0, Math.PI / 2, 0]}
      >
        {`${SKILLS.length} PROCESSES RUNNING · 0 ZOMBIES · APPROACH TO INSPECT`}
      </Text>

      {/* central scheduler column — set back from the doorway so it never blocks the entry view */}
      <mesh position={[cx - 3, 1.1, cz]}>
        <cylinderGeometry args={[0.24, 0.34, 2.2, 6]} />
        <meshStandardMaterial color="#0d1620" metalness={0.8} roughness={0.3} emissive="#4da6ff" emissiveIntensity={0.25} />
      </mesh>
      <pointLight position={[cx - 3, 2.6, cz]} color="#4da6ff" intensity={18} distance={12} decay={1.8} />

      {slots.map((slot, i) => (
        <ProcessCard
          key={slot.skill.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          skill={slot.skill}
          anim={slot.anim}
          position={slot.position}
          rotationY={slot.rotationY}
        />
      ))}
    </group>
  )
}
