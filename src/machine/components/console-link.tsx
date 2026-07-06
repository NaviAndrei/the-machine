import { useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import type { ContactLink } from '../../data/types'
import { useMachine } from '../../state/store'
import '../shaders/crt-material'
import { FONT, FONT_BOLD } from '../fonts'

interface ConsoleLinkProps {
  link: ContactLink
  position: [number, number, number]
  rotationY?: number
  showAnchor: boolean
}

/** pedestal console with a CRT screen — one per contact channel */
export function ConsoleLink({ link, position, rotationY = 0, showAnchor }: ConsoleLinkProps) {
  const screenMat = useRef<ShaderMaterial & { uTime: number; uIntensity: number }>(null)
  const hovered = useRef(false)
  const reducedMotion = useMachine((s) => s.reducedMotion)

  useFrame((state, delta) => {
    if (!screenMat.current) return
    if (!reducedMotion) screenMat.current.uTime = state.clock.elapsedTime
    const target = hovered.current ? 1.8 : 1
    screenMat.current.uIntensity += (target - screenMat.current.uIntensity) * Math.min(1, delta * 8)
  })

  const open = () => {
    if (link.href.startsWith('mailto:')) window.location.href = link.href
    else window.open(link.href, '_blank', 'noopener')
  }

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* pedestal */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 1.1, 0.55]} />
        <meshStandardMaterial color="#0a1017" metalness={0.75} roughness={0.4} />
      </mesh>
      {/* screen housing, tilted toward the visitor */}
      <group
        position={[0, 1.32, 0.05]}
        rotation={[-0.35, 0, 0]}
        onClick={(event) => {
          event.stopPropagation()
          open()
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          hovered.current = true
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          hovered.current = false
          document.body.style.cursor = ''
        }}
      >
        <mesh>
          <boxGeometry args={[1.3, 0.85, 0.1]} />
          <meshStandardMaterial color="#0d1620" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[1.14, 0.68]} />
          <crtScreenMaterial ref={screenMat} />
        </mesh>
        <Text
          font={FONT_BOLD}
          fontSize={0.13}
          color="#c7f5df"
          anchorX="center"
          position={[0, 0.14, 0.062]}
        >
          {link.label}
        </Text>
        <Text font={FONT} fontSize={0.062} color="#9adfc0" anchorX="center" position={[0, -0.02, 0.062]}>
          {link.value}
        </Text>
        <Text font={FONT} fontSize={0.055} color="#5b7482" anchorX="center" position={[0, -0.22, 0.062]}>
          {`${link.protocol}:// — CLICK TO OPEN`}
        </Text>
      </group>
      {/* real anchor for keyboard / semantics, mounted only inside the room */}
      {showAnchor && (
        <Html position={[0, 0.62, 0.35]} center zIndexRange={[10, 0]}>
          <a
            href={link.href}
            target={link.id === 'email' ? undefined : '_blank'}
            rel={link.id === 'email' ? undefined : 'noreferrer'}
            className="holo-in block whitespace-nowrap border border-neon/40 bg-void/90 px-2 py-1 font-mono text-[10px] tracking-widest text-neon hover:bg-neon/10"
          >
            OPEN {link.label} ↗
          </a>
        </Html>
      )}
    </group>
  )
}
