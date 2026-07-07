import { PROFILE } from '../../data/profile'

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="border-b border-panel-2 py-16">
      <h2 id="about-heading" className="text-lg tracking-[0.25em] text-neon">
        /ABOUT <span className="text-dim">— CORE</span>
      </h2>

      <div className="mt-8 space-y-4">
        {PROFILE.bio.map((paragraph, i) => (
          <p key={i} className="max-w-2xl text-sm leading-relaxed text-ink/90">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {PROFILE.narrative.map((block) => (
          <article key={block.title} className="border border-panel-2 bg-panel/50 p-4">
            <h3 className="text-xs tracking-[0.3em] text-volt">{block.title}</h3>
            <p className="mt-3 text-xs leading-relaxed text-dim">{block.body}</p>
          </article>
        ))}
      </div>

      <h3 className="mt-12 text-xs tracking-[0.3em] text-dim">TIMELINE</h3>
      <ol className="mt-4 border-l border-panel-2">
        {PROFILE.timeline.map((entry) => (
          <li key={entry.period + entry.title} className="relative pb-8 pl-6 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-1 h-2.5 w-2.5 border border-neon bg-void" />
            <p className="text-[11px] tracking-widest text-neon">{entry.period}</p>
            <p className="mt-1 text-sm text-ink">
              {entry.title} <span className="text-dim">· {entry.org}</span>
            </p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-dim">{entry.details}</p>
            {entry.project && (
              <div className="mt-3 max-w-xl border-l-2 border-volt/50 pl-3">
                <p className="text-[10px] tracking-[0.3em] text-volt">{entry.project.tag}</p>
                <p className="mt-1 text-xs text-ink/90">{entry.project.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-dim">{entry.project.body}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
