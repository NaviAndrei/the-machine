import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMachine } from '../state/store'
import { ROOMS } from '../machine/layout'
import { MiniMap } from './mini-map'

// FIX: 3D onboarding overlay
const VISITED_KEY = '3d-visited'

export function Hud() {
  const currentRoom = useMachine((s) => s.currentRoom)
  const setMode = useMachine((s) => s.setMode)
  const [showHelp, setShowHelp] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem(VISITED_KEY) !== 'true'
    } catch {
      return true
    }
  })

  const dismissOnboarding = () => {
    setShowOnboarding(false)
    try {
      localStorage.setItem(VISITED_KEY, 'true')
    } catch {
      /* storage unavailable — overlay will just show again next visit */
    }
  }

  useEffect(() => {
    if (!showOnboarding) return
    const timer = setTimeout(dismissOnboarding, 3000)
    window.addEventListener('keydown', dismissOnboarding)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', dismissOnboarding)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnboarding])

  useEffect(() => {
    setCoarsePointer(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const room = ROOMS[currentRoom]

  return (
    <div className="pointer-events-none absolute inset-0 z-20 font-mono">
      {/* current location */}
      <div className="absolute left-5 top-5">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentRoom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="hud-glitch"
          >
            <p className="text-xl tracking-widest text-neon sm:text-2xl">
              {room.path}
              <span className="boot-cursor ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] bg-neon/80" />
            </p>
            <p className="mt-1 text-[10px] tracking-[0.35em] text-dim">{room.label}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* top-right controls */}
      <div className="pointer-events-auto absolute right-5 top-5 flex gap-2">
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          aria-expanded={showHelp}
          className="flex min-h-11 min-w-11 items-center justify-center border border-dim/40 bg-void/70 px-2.5 py-1.5 text-[11px] tracking-widest text-dim backdrop-blur transition-colors motion-reduce:transition-none hover:border-volt hover:text-volt active:border-volt active:text-volt"
        >
          [?]
        </button>
        <button
          type="button"
          onClick={() => setMode('2d')}
          className="flex min-h-11 items-center justify-center border border-dim/40 bg-void/70 px-2.5 py-1.5 text-[11px] tracking-widest text-dim backdrop-blur transition-colors motion-reduce:transition-none hover:border-neon hover:text-neon active:border-neon active:text-neon"
        >
          2D MODE
        </button>
      </div>

      {/* help panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto absolute right-5 top-16 w-64 border border-panel-2 bg-void/90 p-4 text-[11px] leading-relaxed text-dim backdrop-blur"
          >
            <p className="tracking-[0.3em] text-volt">CONTROLS</p>
            <ul className="mt-3 space-y-1.5">
              {coarsePointer ? (
                <>
                  <li><span className="text-ink">DRAG</span> — look around</li>
                  <li><span className="text-ink">TAP BEACON</span> — auto-travel</li>
                  <li><span className="text-ink">TAP MAP ROOM</span> — travel there</li>
                </>
              ) : (
                <>
                  <li><span className="text-ink">W A S D / ↑↓</span> — move</li>
                  <li><span className="text-ink">Q E / ← →</span> — turn</li>
                  <li><span className="text-ink">DRAG</span> — look around</li>
                  <li><span className="text-ink">CLICK BEACON</span> — auto-travel</li>
                  <li><span className="text-ink">MAP ROOMS</span> — click to travel</li>
                </>
              )}
            </ul>
            <p className="mt-3 border-t border-panel-2 pt-3">
              Prefer a quiet interface? <span className="text-neon">2D MODE</span> has everything, scrollable.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIX: 3D onboarding overlay — replaces the old always-shown bottom hint */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismissOnboarding}
            className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-void/50"
          >
            <p className="whitespace-nowrap border border-neon/50 bg-void/90 px-5 py-3 text-[11px] tracking-[0.25em] text-neon sm:text-xs">
              {coarsePointer
                ? '[ DRAG: LOOK ] [ TAP BEACON: ENTER ]'
                : '[ WASD: MOVE ] [ DRAG: LOOK ] [ CLICK: ENTER BEACON ]'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* minimap */}
      <div className="pointer-events-auto absolute bottom-5 right-5">
        <MiniMap />
      </div>
    </div>
  )
}
