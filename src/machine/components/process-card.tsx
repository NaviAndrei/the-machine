import { forwardRef, useMemo } from 'react'
import { Color, Group, MeshStandardMaterial } from 'three'
import { Text } from '@react-three/drei'
import type { SkillEntry } from '../../data/types'
import { FONT, FONT_BOLD } from '../fonts'

export const CARD_W = 2.3
export const CARD_H = 1.35

/** per-card mutable animation state, driven by the skills room frame loop */
export interface CardAnim {
  floatPhase: number
  brightness: number
  fill: number
  backing: MeshStandardMaterial
  fillMat: MeshStandardMaterial
  baseY: number
}

function accentFor(skill: SkillEntry): string {
  if (skill.tier === 'self-directed') return '#ffb84d'
  return skill.category === 'ops' ? '#4da6ff' : '#39ff9c'
}

export function createCardAnim(skill: SkillEntry, index: number, baseY: number): CardAnim {
  const accent = new Color(accentFor(skill))
  return {
    floatPhase: index * 1.31,
    brightness: 0,
    fill: 0,
    baseY,
    backing: new MeshStandardMaterial({
      color: new Color('#0a141c'),
      metalness: 0.75,
      roughness: 0.35,
      emissive: accent,
      emissiveIntensity: 0.03,
    }),
    fillMat: new MeshStandardMaterial({
      color: new Color('#000000'),
      emissive: accent,
      emissiveIntensity: 1.8,
    }),
  }
}

interface ProcessCardProps {
  skill: SkillEntry
  anim: CardAnim
  position: [number, number, number]
  rotationY: number
}

/** floating "process" panel — one per skill */
export const ProcessCard = forwardRef<Group, ProcessCardProps>(function ProcessCard(
  { skill, anim, position, rotationY },
  ref,
) {
  const accent = useMemo(() => accentFor(skill), [skill])

  return (
    <group ref={ref} position={position} rotation={[0, rotationY, 0]}>
      {/* backing panel */}
      <mesh material={anim.backing}>
        <boxGeometry args={[CARD_W, CARD_H, 0.06]} />
      </mesh>
      {/* header */}
      <Text
        font={FONT_BOLD}
        fontSize={0.165}
        color="#c7d6dd"
        anchorX="left"
        anchorY="middle"
        position={[-CARD_W / 2 + 0.18, CARD_H / 2 - 0.24, 0.04]}
      >
        {skill.name}
      </Text>
      <Text
        font={FONT}
        fontSize={0.085}
        color="#5b7482"
        anchorX="left"
        anchorY="middle"
        position={[-CARD_W / 2 + 0.18, CARD_H / 2 - 0.46, 0.04]}
      >
        {`PID ${skill.pid} · STATE ${skill.tier === 'verified' ? 'running' : 'active'} · ${skill.category.toUpperCase()}`}
      </Text>
      {skill.tier === 'verified' ? (
        <>
          {/* uptime counter */}
          <Text
            font={FONT}
            fontSize={0.105}
            color={accent}
            anchorX="left"
            anchorY="middle"
            position={[-CARD_W / 2 + 0.18, 0.02, 0.04]}
          >
            {`UPTIME ${skill.years}y`}
          </Text>
          <Text
            font={FONT}
            fontSize={0.105}
            color="#c7d6dd"
            anchorX="right"
            anchorY="middle"
            position={[CARD_W / 2 - 0.18, 0.02, 0.04]}
          >
            {`${skill.proficiency}%`}
          </Text>
          {/* proficiency bar: track + animated fill */}
          <mesh position={[0, -0.3, 0.04]}>
            <boxGeometry args={[CARD_W - 0.36, 0.07, 0.015]} />
            <meshStandardMaterial color="#0d1620" metalness={0.4} roughness={0.6} />
          </mesh>
          {/* fill scales from the left edge; the room loop sets scale.x + position.x */}
          <mesh name="bar-fill" material={anim.fillMat} position={[-(CARD_W - 0.36) / 2, -0.3, 0.05]} scale={[0.001, 1, 1]}>
            <boxGeometry args={[CARD_W - 0.36, 0.055, 0.015]} />
          </mesh>
        </>
      ) : (
        <Text
          font={FONT_BOLD}
          fontSize={0.11}
          color={accent}
          anchorX="center"
          anchorY="middle"
          position={[0, -0.02, 0.04]}
        >
          {skill.status.toUpperCase()}
        </Text>
      )}
      {/* status LED */}
      <mesh position={[CARD_W / 2 - 0.16, CARD_H / 2 - 0.16, 0.045]}>
        <circleGeometry args={[0.03, 12]} />
        <meshBasicMaterial color={new Color(accent).multiplyScalar(2.0)} />
      </mesh>
    </group>
  )
})
