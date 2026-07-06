import { SKILLS } from '../../data/skills'

export function SkillsSection() {
  const ops = SKILLS.filter((s) => s.category === 'ops')
  const dev = SKILLS.filter((s) => s.category === 'dev')

  return (
    <section id="skills" aria-labelledby="skills-heading" className="border-b border-panel-2 py-16">
      <h2 id="skills-heading" className="text-lg tracking-[0.25em] text-neon">
        /SKILLS <span className="text-dim">— SCHEDULER</span>
      </h2>
      <p className="mt-2 text-[11px] tracking-widest text-dim">
        RUNNING PROCESSES — VERIFIED PROFICIENCY &amp; UPTIME, SELF-DIRECTED LAB SKILLS
      </p>

      {[
        { title: 'OPS STACK', list: ops, accent: 'volt' as const },
        { title: 'DEV / AI STACK', list: dev, accent: 'neon' as const },
      ].map((group) => (
        <div key={group.title} className="mt-8">
          <h3 className="text-xs tracking-[0.3em] text-dim">{group.title}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {group.list.map((skill) => (
              <li key={skill.id} className="border border-panel-2 bg-panel/50 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink">{skill.name}</span>
                  <span className="text-[10px] tracking-widest text-dim">PID {skill.pid}</span>
                </div>
                {skill.tier === 'verified' ? (
                  <>
                    <div className="mt-2 flex items-center gap-3">
                      <div
                        role="meter"
                        aria-valuenow={skill.proficiency}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill.name} proficiency`}
                        className="h-1.5 flex-1 bg-panel-2"
                      >
                        <div
                          className={`h-full motion-safe:transition-[width] motion-safe:duration-700 ${
                            group.accent === 'volt' ? 'bg-volt' : 'bg-neon'
                          }`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-[11px] text-dim">{skill.proficiency}%</span>
                    </div>
                    <p className="mt-2 text-[11px] tracking-wider text-dim">
                      UPTIME {skill.years}y · STATE running
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-[11px] tracking-widest text-[#ffb84d]">{skill.status.toUpperCase()}</p>
                )}
                <p className="mt-1 text-[11px] leading-relaxed text-dim/80">{skill.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
