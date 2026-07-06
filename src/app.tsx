import { lazy, Suspense, useEffect } from 'react'
import { useMachine } from './state/store'
import { BootScreen } from './boot/boot-screen'
import { FlatSite } from './fallback/flat-site'

const MachineExperience = lazy(() => import('./machine/machine-experience'))

export default function App() {
  const mode = useMachine((s) => s.mode)
  const bootPhase = useMachine((s) => s.bootPhase)

  // pull the heavy 3D chunk down while the visitor watches the boot screen
  useEffect(() => {
    if (mode === '3d') void import('./machine/machine-experience')
  }, [mode])

  if (mode === '2d') return <FlatSite />

  return (
    <div className="fixed inset-0 overflow-hidden bg-void">
      {bootPhase !== 'post' && (
        <Suspense fallback={null}>
          <MachineExperience />
        </Suspense>
      )}
      {bootPhase !== 'done' && <BootScreen />}
    </div>
  )
}
