import type { ReactNode } from 'react'
import { Html } from '@react-three/drei'
import { matPanel } from '../materials'
import { stripFor } from '../materials'

// drei's <Html transform> maps CSS px to world units via distanceFactor/400.
// A small distanceFactor gives a denser CSS pixel budget for the same
// physical plate size, so real content (paragraphs, lists) has room to lay out.
const DISTANCE_FACTOR = 2
const PX_PER_UNIT = 400 / DISTANCE_FACTOR

interface HoloPanelProps {
  position: [number, number, number]
  rotationY: number
  accent: string
  /** panel plate size in world units */
  width?: number
  height?: number
  /** real DOM content projected onto the plate */
  children: ReactNode
  delayMs?: number
}

/**
 * Wall-mounted holographic display: a metal plate with edge lighting and
 * real (selectable, screen-reader-visible) HTML projected onto it.
 * Mounted only while the visitor is in the room — see AboutRoom.
 */
export function HoloPanel({
  position,
  rotationY,
  accent,
  width = 3.4,
  height = 2.5,
  children,
  delayMs = 0,
}: HoloPanelProps) {
  const strip = stripFor(accent)
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* backing plate */}
      <mesh material={matPanel}>
        <boxGeometry args={[width + 0.25, height + 0.25, 0.08]} />
      </mesh>
      {/* edge light strips */}
      <mesh position={[0, height / 2 + 0.16, 0]} material={strip}>
        <boxGeometry args={[width + 0.25, 0.04, 0.04]} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.16, 0]} material={strip}>
        <boxGeometry args={[width + 0.25, 0.04, 0.04]} />
      </mesh>
      <Html
        transform
        distanceFactor={DISTANCE_FACTOR}
        position={[0, 0, 0.06]}
        style={{ width: `${width * PX_PER_UNIT}px`, height: `${height * PX_PER_UNIT}px` }}
        zIndexRange={[10, 0]}
      >
        <div
          className="holo-in scanlines-overlay relative h-full w-full overflow-hidden border p-8 font-mono backdrop-blur-sm"
          style={{
            animationDelay: `${delayMs}ms`,
            borderColor: `${accent}55`,
            background: 'rgba(5, 8, 10, 0.88)',
            boxShadow: `inset 0 0 60px ${accent}14`,
          }}
        >
          {children}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-25" />
        </div>
      </Html>
    </group>
  )
}
