import { useEffect, useMemo, useRef } from 'react'
import { Color, MathUtils, Euler, Vector3, type InstancedMesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances, type PositionMesh } from '@react-three/drei'
import { COMMIT_WEEKS, MAX_WEEK_COMMITS } from '../../data/projects'
import { playerState, useMachine } from '../../state/store'
import { ROOMS } from '../layout'

const GOLDEN = 2.39996 // golden angle, radians

const pseudo = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

interface Shard {
  position: Vector3
  rotation: Euler
  scale: Vector3
  color: Color
}

const BUILD_SECONDS = 2.6

/**
 * A year of commit history grown into a crystalline column.
 * Week index climbs the helix; commit density sets shard count, size and color.
 */
export function CommitTower() {
  const [cx, cz] = ROOMS.projects.center
  const instances = useRef<InstancedMesh>(null)
  const shardRefs = useRef<(PositionMesh | null)[]>([])
  const spin = useRef<number>(0)
  const progress = useRef(0)
  const wasInside = useRef(false)

  const shards = useMemo<Shard[]>(() => {
    const volt = new Color('#4da6ff')
    const neon = new Color('#39ff9c')
    const list: Shard[] = []
    COMMIT_WEEKS.forEach(({ week, commits }) => {
      const density = commits / MAX_WEEK_COMMITS
      const count = Math.max(1, Math.round(commits / 2))
      for (let i = 0; i < count; i++) {
        const seed = week * 13.7 + i * 5.1
        const angle = week * GOLDEN + i * 1.7 + pseudo(seed) * 0.7
        const radius = 1.2 + pseudo(seed + 1) * 1.5 + density * 0.6
        const y = 0.5 + week * 0.165 + pseudo(seed + 2) * 0.14
        const size = 0.35 + pseudo(seed + 3) * 0.5 + density * 0.35
        list.push({
          position: new Vector3(radius * Math.sin(angle), y, radius * Math.cos(angle)),
          rotation: new Euler(pseudo(seed + 4) * 0.7, angle, pseudo(seed + 5) * 0.7),
          scale: new Vector3(size * 0.35, size * (1.4 + density), size * 0.35),
          color: volt.clone().lerp(neon, density).multiplyScalar(0.35 + density * 1.65),
        })
      }
    })
    return list
  }, [])

  // static per-shard transform/color, set once the Instance refs exist
  useEffect(() => {
    shards.forEach((shard, i) => {
      const inst = shardRefs.current[i]
      if (!inst) return
      inst.position.copy(shard.position)
      inst.rotation.copy(shard.rotation)
      inst.color.copy(shard.color)
    })
  }, [shards])

  useFrame((state, delta) => {
    if (!instances.current) return
    const machine = useMachine.getState()

    // the tower starts building the moment the visitor steps into the east corridor
    const inside = playerState.x > 5.5 && Math.abs(playerState.z) < 14
    if (inside && !wasInside.current && progress.current >= 1) progress.current = 0 // rebuild on re-entry
    wasInside.current = inside

    const target = inside ? 1 : progress.current // never un-build mid-room
    if (machine.reducedMotion) progress.current = inside ? 1 : progress.current
    else progress.current = Math.min(target, progress.current + delta / BUILD_SECONDS)

    if (!machine.reducedMotion) spin.current += delta * 0.06

    const total = shards.length
    shards.forEach((shard, i) => {
      const inst = shardRefs.current[i]
      if (!inst) return
      // staggered pop-in, oldest weeks first
      const local = MathUtils.clamp((progress.current * (total + 24) - i) / 24, 0, 1)
      const pop = MathUtils.smoothstep(local, 0, 1)
      inst.scale.copy(shard.scale).multiplyScalar(pop)
    })
    instances.current.rotation.y = spin.current
    void state
  })

  return (
    <group position={[cx, 0, cz]}>
      {/* pedestal */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[3.6, 4.1, 0.36, 10]} />
        <meshStandardMaterial color="#0a1017" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.35, 48]} />
        <meshBasicMaterial color={new Color('#39ff9c').multiplyScalar(1.6)} />
      </mesh>

      <Instances ref={instances} limit={shards.length} range={shards.length}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial toneMapped={false} />
        {shards.map((_, i) => (
          <Instance
            key={i}
            ref={(el: PositionMesh | null) => {
              shardRefs.current[i] = el
            }}
          />
        ))}
      </Instances>

      {/* internal glow */}
      <pointLight position={[0, 4.5, 0]} color="#39ff9c" intensity={30} distance={16} decay={1.9} />
    </group>
  )
}
