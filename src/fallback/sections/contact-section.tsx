import { CONTACT_LINKS } from '../../data/contact'

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-16">
      <h2 id="contact-heading" className="text-lg tracking-[0.25em] text-neon">
        /CONTACT <span className="text-dim">— I/O PORT</span>
      </h2>
      <p className="mt-2 max-w-xl text-xs leading-relaxed text-dim">
        Direct lines only — no forms, no middleware. Pick a port.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {CONTACT_LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target={link.id === 'email' ? undefined : '_blank'}
              rel={link.id === 'email' ? undefined : 'noreferrer'}
              className="group block border border-panel-2 bg-panel/50 p-4 transition-colors hover:border-neon/60"
            >
              <p className="flex items-baseline justify-between text-[10px] tracking-widest text-dim">
                <span>{link.protocol}://</span>
                <span aria-hidden="true" className="text-neon opacity-0 transition-opacity group-hover:opacity-100">
                  ▸ OPEN
                </span>
              </p>
              <p className="mt-3 text-sm tracking-widest text-volt">{link.label}</p>
              <p className="mt-1 break-all text-xs text-ink/80">{link.value}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
