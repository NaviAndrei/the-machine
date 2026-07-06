import { useRef } from 'react'
import { Color, Group, Mesh, MeshStandardMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html, Text } from '@react-three/drei'
import type { ProjectEntry } from '../../data/types'
import { useMachine } from '../../state/store'
import { FONT } from '../fonts'

const STATUS_COLOR: Record<ProjectEntry['status'], string> = {
  online: '#39ff9c',
  building: '#4da6ff',
  archived: '#5b7482',
}

interface ProjectNodeProps {
  project: ProjectEntry
  position: [number, number, number]
}

/** clickable data node orbiting the commit tower — opens the repo card */
export function ProjectNode({ project, position }: ProjectNodeProps) {
  const selectProject = useMachine((s) => s.selectProject)
  const reducedMotion = useMachine((s) => s.reducedMotion)
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const hovered = useRef(false)
  const phase = useRef(Math.random() * Math.PI * 2)
  const accent = STATUS_COLOR[project.status]

  useFrame((_, delta) => {
    if (!group.current || !core.current) return
    if (!reducedMotion) {
      phase.current += delta
      group.current.position.y = position[1] + Math.sin(phase.current * 0.8) * 0.12
      core.current.rotation.y += delta * (hovered.current ? 2.4 : 0.5)
      core.current.rotation.x += delta * 0.2
    }
    const mat = core.current.material as MeshStandardMaterial
    const target = hovered.current ? 1.9 : 0.75
    mat.emissiveIntensity += (target - mat.emissiveIntensity) * Math.min(1, delta * 8)
    const s = hovered.current ? 1.18 : 1
    core.current.scale.x += (s - core.current.scale.x) * Math.min(1, delta * 8)
    core.current.scale.y = core.current.scale.z = core.current.scale.x
  })

  return (
    <group
      ref={group}
      position={position}
      onClick={(event) => {
        event.stopPropagation()
        selectProject(project.id)
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
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#0a141c"
          metalness={0.6}
          roughness={0.25}
          emissive={new Color(accent)}
          emissiveIntensity={0.75}
          flatShading
        />
      </mesh>
      {/* wireframe halo */}
      <mesh scale={1.35}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.18} />
      </mesh>
      <Billboard position={[0, -0.85, 0]}>
        <Text font={FONT} fontSize={0.16} color="#c7d6dd" anchorX="center">
          {`~/${project.name}`}
        </Text>
        <Text font={FONT} fontSize={0.09} color={accent} anchorX="center" position={[0, -0.19, 0]}>
          {`● ${project.status.toUpperCase()} — CLICK TO MOUNT`}
        </Text>
      </Billboard>
      {/* real button for keyboard / screen-reader access, mirrors console-link.tsx's pattern */}
      <Html position={[0, 0, 0]} center zIndexRange={[10, 0]} occlude={false}>
        <button
          type="button"
          onClick={() => selectProject(project.id)}
          className="holo-in whitespace-nowrap border border-current/40 bg-void/90 px-2 py-1 font-mono text-[10px] tracking-widest opacity-0 focus:opacity-100"
          style={{ color: accent }}
        >
          OPEN ~/{project.name} — {project.status.toUpperCase()}
        </button>
      </Html>
    </group>
  )
}
