import { COMMIT_WEEKS, MAX_WEEK_COMMITS, PROJECTS } from '../../data/projects'

const STATUS_STYLE: Record<string, string> = {
  online: 'text-neon border-neon/40',
  building: 'text-volt border-volt/40',
  archived: 'text-dim border-dim/40',
}

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="border-b border-panel-2 py-16">
      <h2 id="projects-heading" className="text-lg tracking-[0.25em] text-neon">
        /PROJECTS <span className="text-dim">— STORAGE ARRAY</span>
      </h2>

      <figure className="mt-8">
        <figcaption className="text-[11px] tracking-widest text-dim">
          COMMIT ACTIVITY — LAST 52 WEEKS (simulated)
        </figcaption>
        <svg
          viewBox={`0 0 ${52 * 6} 48`}
          role="img"
          aria-label="Bar chart of weekly commit activity over the last year"
          className="mt-2 h-16 w-full border border-panel-2 bg-panel/40 p-1"
          preserveAspectRatio="none"
        >
          {COMMIT_WEEKS.map(({ week, commits }) => {
            const h = Math.max(2, (commits / MAX_WEEK_COMMITS) * 40)
            return (
              <rect
                key={week}
                x={week * 6 + 1}
                y={44 - h}
                width={4}
                height={h}
                fill={commits > MAX_WEEK_COMMITS * 0.55 ? 'var(--color-neon)' : 'var(--color-volt)'}
                opacity={0.35 + (commits / MAX_WEEK_COMMITS) * 0.65}
              />
            )
          })}
        </svg>
      </figure>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <li key={project.id}>
            <article className="flex h-full flex-col border border-panel-2 bg-panel/50 p-4 transition-colors hover:border-dim">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm text-ink">~/{project.name}</h3>
                <span
                  className={`border px-1.5 py-0.5 text-[10px] tracking-widest ${STATUS_STYLE[project.status]}`}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 text-xs text-volt">{project.tagline}</p>
              <p className="mt-3 flex-1 text-xs leading-relaxed text-dim">{project.description}</p>
              <p className="mt-4 text-[11px] tracking-wider text-dim">
                {project.stack.map((tech) => `[${tech}]`).join(' ')}
              </p>
              <p className="mt-3 flex gap-4 text-xs">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neon underline-offset-4 hover:underline"
                  >
                    REPO ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-volt underline-offset-4 hover:underline"
                  >
                    LIVE ↗
                  </a>
                )}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
