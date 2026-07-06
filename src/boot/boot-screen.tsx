import { useEffect, useRef, useState } from 'react'
import { useMachine } from '../state/store'
import { BOOT_LINES, MEMORY_COUNT_MS, MEMORY_TOTAL } from './boot-lines'

const VISITED_KEY = 'machine:visited'
const WIPE_MS = 700

export function BootScreen() {
  const bootPhase = useMachine((s) => s.bootPhase)

  const [visibleLines, setVisibleLines] = useState(0)
  const [memory, setMemory] = useState(0)
  const [showSkipHint, setShowSkipHint] = useState(false)
  const doneRef = useRef(false)

  // reveal lines on an irregular firmware-style schedule
  useEffect(() => {
    let revisit = false
    try {
      revisit = localStorage.getItem(VISITED_KEY) === '1'
      localStorage.setItem(VISITED_KEY, '1')
    } catch {
      /* ignore */
    }
    const hintTimer = setTimeout(() => setShowSkipHint(true), revisit ? 150 : 1100)

    // precompute each line's reveal time on the wall clock
    const schedule: number[] = []
    let elapsed = 0
    BOOT_LINES.forEach((line) => {
      elapsed += line.delay
      schedule.push(elapsed)
      if (line.memoryCount) elapsed += MEMORY_COUNT_MS
    })
    const endAt = elapsed + 500

    // rAF-driven (with a timer fallback for hidden tabs) so throttling can
    // never stall the boot sequence
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const now = performance.now() - start
      let lines = 0
      while (lines < schedule.length && now >= schedule[lines]) lines += 1
      setVisibleLines(lines)
      const memoryLine = BOOT_LINES.findIndex((l) => l.memoryCount)
      if (memoryLine >= 0 && lines > memoryLine) {
        const t = Math.min(1, (now - schedule[memoryLine]) / MEMORY_COUNT_MS)
        setMemory(Math.floor(MEMORY_TOTAL * t))
      }
      if (now >= endAt) {
        beginWipe()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const fallback = setInterval(() => {
      if (performance.now() - start >= endAt) beginWipe()
    }, 1000)

    return () => {
      clearTimeout(hintTimer)
      clearInterval(fallback)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const beginWipe = () => {
    if (doneRef.current) return
    doneRef.current = true
    useMachine.getState().startWipe()
    setTimeout(() => useMachine.getState().finishBoot(), WIPE_MS)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') beginWipe()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wiping = bootPhase === 'wipe'

  return (
    <div
      className={`fixed inset-0 z-50 bg-void font-mono ${wiping ? 'boot-wipe' : ''}`}
      aria-hidden="true"
    >
      <div className="crt-flicker relative h-full w-full overflow-hidden p-6 sm:p-10">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
        <pre className="relative text-[11px] leading-[1.7] text-ink/90 sm:text-[13px]">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) =>
            line.memoryCount ? (
              <div key={i}>
                {'Memory Test    : '}
                <span className="text-neon">{memory.toString().padStart(5, ' ')}</span>
                {' MB'}
                {memory >= MEMORY_TOTAL ? '  OK' : ''}
              </div>
            ) : (
              <div key={i} className={line.className}>
                {line.text || ' '}
              </div>
            ),
          )}
          <div className="boot-cursor inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-neon/80" />
        </pre>

        {showSkipHint && !wiping && (
          <button
            type="button"
            onClick={beginWipe}
            className="absolute bottom-6 right-6 border border-dim/40 px-3 py-1.5 text-[11px] tracking-widest text-dim transition-colors hover:border-neon hover:text-neon sm:bottom-10 sm:right-10"
          >
            [ESC] SKIP BOOT ▸
          </button>
        )}
      </div>
      <span className="sr-only">Loading portfolio…</span>
    </div>
  )
}
