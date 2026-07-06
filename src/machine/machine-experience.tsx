import { MachineCanvas } from './machine-canvas'
import { Hud } from '../hud/hud'
import { ProjectModal } from '../hud/project-modal'
import { useIsMobile } from '../lib/use-mobile'

/** lazy-loaded 3D chunk: canvas + HUD overlay */
export default function MachineExperience() {
  const mobile = useIsMobile()

  return (
    <div className="machine-fade-in absolute inset-0">
      <MachineCanvas />
      {/* full-viewport CSS scanline overlay is a cosmetic-only cost — skip on mobile */}
      {!mobile && <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.06]" />}
      <Hud />
      <ProjectModal />
    </div>
  )
}
