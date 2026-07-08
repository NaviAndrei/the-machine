import { useEffect, useState } from 'react'
import { useMachine } from '../state/store'
import { webglCapable } from '../lib/detect-capability'
import { sectionIdFromHash } from '../lib/use-hash-sync'
import { PROFILE } from '../data/profile'
import { AboutSection } from './sections/about-section'
import { ProjectsSection } from './sections/projects-section'
import { SkillsSection } from './sections/skills-section'
import { ContactSection } from './sections/contact-section'

const NAV = [
  { id: 'about', label: '/about' },
  { id: 'projects', label: '/projects' },
  { id: 'skills', label: '/skills' },
  { id: 'contact', label: '/contact' },
]

const NAV_OPEN_KEY = 'nav-open'

export function FlatSite() {
  const setMode = useMachine((s) => s.setMode)
  // FIX: mobile nav hamburger
  const [navOpen, setNavOpen] = useState(() => {
    try {
      return localStorage.getItem(NAV_OPEN_KEY) === 'true'
    } catch {
      return false
    }
  })

  // deep links like #/projects land on the right section
  useEffect(() => {
    const id = sectionIdFromHash()
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  const toggleNav = () => {
    const next = !navOpen
    setNavOpen(next)
    try {
      localStorage.setItem(NAV_OPEN_KEY, String(next))
    } catch {
      /* storage unavailable — state just won't persist */
    }
  }

  const closeNav = () => {
    setNavOpen(false)
    try {
      localStorage.setItem(NAV_OPEN_KEY, 'false')
    } catch {
      /* storage unavailable — state just won't persist */
    }
  }

  const navLinks = (onNavigate?: () => void) => (
    <>
      {NAV.map((item) => (
        <a
          key={item.id}
          href={`#/${item.id}`}
          onClick={(event) => {
            event.preventDefault()
            document.getElementById(item.id)?.scrollIntoView()
            history.replaceState(null, '', `#/${item.id}`)
            onNavigate?.()
          }}
          className="inline-flex min-h-11 items-center text-xs tracking-wider text-dim transition-colors motion-reduce:transition-none hover:text-neon focus-visible:text-neon active:text-neon"
        >
          {item.label}
        </a>
      ))}
      {webglCapable() && (
        <button
          type="button"
          onClick={() => {
            onNavigate?.()
            setMode('3d')
          }}
          className="flex min-h-11 items-center justify-center border border-volt/50 px-2.5 py-1 text-xs tracking-widest text-volt transition-colors motion-reduce:transition-none hover:border-volt hover:bg-volt/10 active:border-volt active:bg-volt/10"
        >
          BOOT 3D ▸
        </button>
      )}
    </>
  )

  return (
    <div className="min-h-full bg-void font-mono text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-neon focus:bg-void focus:px-3 focus:py-2 focus:text-neon"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-panel-2 bg-void/90 backdrop-blur">
        <nav aria-label="Primary" className="mx-auto flex max-w-4xl items-center gap-x-5 px-4 py-3">
          <span className="mr-auto text-sm tracking-widest text-neon">IVAN_ANDREI ▮</span>
          {/* FIX: mobile nav hamburger — links stay inline on wider screens, single row never wraps */}
          <div className="hidden items-center gap-x-5 sm:flex">{navLinks()}</div>
          <button
            type="button"
            onClick={toggleNav}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            className="flex min-h-11 min-w-11 items-center justify-center border border-dim/40 text-sm text-dim transition-colors hover:border-neon hover:text-neon sm:hidden"
          >
            {navOpen ? '✕' : '☰'}
          </button>
        </nav>
        {navOpen && (
          <div
            id="mobile-nav"
            className="flex flex-col gap-3 border-t border-panel-2 px-4 py-4 sm:hidden"
          >
            {navLinks(closeNav)}
          </div>
        )}
      </header>

      <main id="main" className="mx-auto max-w-4xl px-4">
        {/* hero */}
        <section aria-label="Introduction" className="border-b border-panel-2 py-16 sm:py-24">
          <p className="mb-3 text-xs tracking-[0.3em] text-dim">SYSTEM ONLINE — 2D CONSOLE MODE</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">{PROFILE.name}</h1>
          <p className="mt-3 text-sm text-volt sm:text-base">{PROFILE.role}</p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-dim sm:text-base">{PROFILE.headline}</p>
          <pre
            aria-hidden="true"
            className="mt-10 overflow-x-auto border border-panel-2 bg-panel/60 p-4 text-[11px] leading-relaxed text-dim"
          >
{`$ mount | grep machine
/dev/sda1 on /about     type ext4 (ro,identity)
/dev/sda2 on /skills    type proc (rw,monitored)
/dev/sda3 on /projects  type btrfs (rw,growing)
/dev/sda4 on /contact   type io   (rw,open)`}
          </pre>
        </section>

        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <footer className="border-t border-panel-2 py-10 text-center text-[11px] tracking-wider text-dim">
        <p>Built with React, Three.js &amp; Tailwind</p>
        <p className="mt-2">© 2026 IVAN ANDREI — THE MACHINE v0.1.0</p>
      </footer>
    </div>
  )
}
