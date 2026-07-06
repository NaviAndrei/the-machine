import { useMemo } from 'react'
import { Color } from 'three'
import { Text } from '@react-three/drei'
import { PROJECTS } from '../../data/projects'
import { ROOMS } from '../layout'
import { CommitTower } from '../components/commit-tower'
import { ProjectNode } from '../components/project-node'
import { FONT_BOLD } from '../fonts'

/** decorative server racks lining the north and south walls */
function Racks() {
  const [cx, cz] = ROOMS.projects.center
  const [w, d] = ROOMS.projects.size

  const racks = useMemo(() => {
    const list: { x: number; z: number }[] = []
    for (let i = 0; i < 7; i++) {
      const x = cx - w / 2 + 2.4 + i * ((w - 4.8) / 6)
      list.push({ x, z: cz - d / 2 + 1.1 })
      list.push({ x, z: cz + d / 2 - 1.1 })
    }
    return list
  }, [cx, cz, w, d])

  const ledColor = useMemo(() => new Color('#39ff9c').multiplyScalar(1.5), [])
  const ledColorAlt = useMemo(() => new Color('#4da6ff').multiplyScalar(1.5), [])

  return (
    <group>
      {racks.map((rack, i) => (
        <group key={i} position={[rack.x, 0, rack.z]}>
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[1.6, 3.2, 1.1]} />
            <meshStandardMaterial color="#0a1017" metalness={0.75} roughness={0.35} />
          </mesh>
          {/* blinkenlights */}
          {Array.from({ length: 5 }, (_, j) => (
            <mesh
              key={j}
              position={[-0.55 + (j % 3) * 0.5, 0.7 + j * 0.55, rack.z < ROOMS.projects.center[1] ? 0.58 : -0.58]}
            >
              <boxGeometry args={[0.14, 0.05, 0.02]} />
              <meshBasicMaterial color={(i + j) % 3 === 0 ? ledColorAlt : ledColor} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export function ProjectsRoom() {
  const room = ROOMS.projects
  const [cx, cz] = room.center

  // nodes spiral around the tower at increasing height
  const nodePositions = useMemo<[number, number, number][]>(() => {
    return PROJECTS.map((_, i) => {
      const theta = -Math.PI / 2 + i * ((Math.PI * 2) / PROJECTS.length)
      const radius = 5.6
      return [cx + radius * Math.sin(theta), 1.7 + i * 0.35, cz + radius * Math.cos(theta)]
    })
  }, [cx, cz])

  return (
    <group>
      <Text
        font={FONT_BOLD}
        fontSize={0.9}
        color="#39ff9c"
        anchorX="center"
        position={[cx + room.size[0] / 2 - 0.6, 7.6, cz]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        /projects — STORAGE ARRAY
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.22}
        color="#5b7482"
        anchorX="center"
        position={[cx + room.size[0] / 2 - 0.6, 6.9, cz]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        52 WEEKS OF COMMITS, CRYSTALLIZED (SIMULATED)
      </Text>

      <CommitTower />
      <Racks />

      {PROJECTS.map((project, i) => (
        <ProjectNode key={project.id} project={project} position={nodePositions[i]} />
      ))}
    </group>
  )
}
