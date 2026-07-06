import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMachine } from '../state/store'
import { ROOMS } from '../machine/layout'
import { MiniMap } from './mini-map'

export function Hud() {
  const currentRoom = useMachine((s) => s.currentRoom)
  const setMode = useMachine((s) => s.setMode)
  const [showHelp, setShowHelp] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 9000)
    return () => clearTimeout(timer)
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
          className="border border-dim/40 bg-void/70 px-2.5 py-1.5 text-[11px] tracking-widest text-dim backdrop-blur transition-colors hover:border-volt hover:text-volt"
        >
          [?]
        </button>
        <button
          type="button"
          onClick={() => setMode('2d')}
          className="border border-dim/40 bg-void/70 px-2.5 py-1.5 text-[11px] tracking-widest text-dim backdrop-blur transition-colors hover:border-neon hover:text-neon"
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
              <li><span className="text-ink">W A S D / ↑↓</span> — move</li>
              <li><span className="text-ink">Q E / ← →</span> — turn</li>
              <li><span className="text-ink">DRAG</span> — look around</li>
              <li><span className="text-ink">CLICK BEACON</span> — auto-travel</li>
              <li><span className="text-ink">MAP ROOMS</span> — click to travel</li>
            </ul>
            <p className="mt-3 border-t border-panel-2 pt-3">
              Prefer a quiet interface? <span className="text-neon">2D MODE</span> has everything, scrollable.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* first-visit control hint */}
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.25em] text-dim sm:text-[11px]"
          >
            WASD MOVE · DRAG LOOK · CLICK BEACONS TO TRAVEL
          </motion.p>
        )}
      </AnimatePresence>

      {/* minimap */}
      <div className="pointer-events-auto absolute bottom-5 right-5">
        <MiniMap />
      </div>
    </div>
  )
}
