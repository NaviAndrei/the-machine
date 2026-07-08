import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, PerformanceMonitor } from '@react-three/drei'
import { useMachine } from '../state/store'
import { World } from './world'
import { Player } from './player'
import { Effects } from './effects'

const CONTROL_MAP = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA'] },
  { name: 'right', keys: ['KeyD'] },
  { name: 'turnLeft', keys: ['KeyQ', 'ArrowLeft'] },
  { name: 'turnRight', keys: ['KeyE', 'ArrowRight'] },
]

export function MachineCanvas() {
  const setQuality = useMachine((s) => s.setQuality)
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.75])

  return (
    <KeyboardControls map={CONTROL_MAP}>
      <Canvas
        dpr={dpr}
        camera={{ fov: 70, near: 0.1, far: 90, position: [0, 1.6, 3] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#05080a')}
        style={{ touchAction: 'none' }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1)
            setQuality('low')
          }}
        >
          <Suspense fallback={null}>
            <World />
            <Player />
            <Effects />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </KeyboardControls>
  )
}
