import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PROJECTS } from '../data/projects'
import { useMachine } from '../state/store'

const STATUS_STYLE: Record<string, string> = {
  online: 'text-neon border-neon/40',
  building: 'text-volt border-volt/40',
  archived: 'text-dim border-dim/40',
}

/** repo card opened by clicking a project node in the storage array */
export function ProjectModal() {
  const selectedProject = useMachine((s) => s.selectedProject)
  const selectProject = useMachine((s) => s.selectProject)
  const closeRef = useRef<HTMLButtonElement>(null)

  const project = PROJECTS.find((p) => p.id === selectedProject)

  useEffect(() => {
    if (!project) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') selectProject(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, selectProject])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-void/60 p-4 backdrop-blur-sm"
          onClick={() => selectProject(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Project ${project.name}`}
            initial={{ scale: 0.94, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-lg border border-panel-2 bg-void font-mono shadow-[0_0_60px_rgba(57,255,156,0.12)]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-panel-2 bg-panel px-4 py-2.5">
              <p className="text-xs tracking-wider text-ink">
                <span className="text-dim">mount</span> ~/projects/{project.name}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => selectProject(null)}
                aria-label="Close project card"
                className="border border-dim/40 px-2 py-0.5 text-[10px] tracking-widest text-dim transition-colors motion-reduce:transition-none hover:border-neon hover:text-neon"
              >
                [ESC] ✕
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg text-ink">{project.name}</h2>
                <span className={`border px-1.5 py-0.5 text-[10px] tracking-widest ${STATUS_STYLE[project.status]}`}>
                  ● {project.status.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 text-xs text-volt">{project.tagline}</p>
              <p className="mt-4 text-xs leading-relaxed text-dim">{project.description}</p>
              <p className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="border border-panel-2 bg-panel px-1.5 py-0.5 text-[10px] tracking-wider text-ink/80">
                    {tech}
                  </span>
                ))}
              </p>
              <p className="mt-5 flex gap-4 text-xs">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-neon underline-offset-4 hover:underline">
                    REPO ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-volt underline-offset-4 hover:underline">
                    LIVE ↗
                  </a>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
