import { useEffect, useMemo } from 'react'
import { Vector2 } from 'three'
import { EffectComposer, Bloom, Noise, Vignette, Glitch, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { useMachine } from '../state/store'
import { useIsMobile } from '../lib/use-mobile'

// Threshold-based bloom: only materials whose color luminance clears ~1.05
// glow (see CLAUDE.md rule 2 — no SelectiveBloom, no second selection pass).
const BLOOM_THRESHOLD = 1.05
const BLOOM_SMOOTHING = 0.12

export function Effects() {
  const quality = useMachine((s) => s.quality)
  const glitching = useMachine((s) => s.glitching)
  const reducedMotion = useMachine((s) => s.reducedMotion)
  const mobile = useIsMobile()

  const glitchDelay = useMemo(() => new Vector2(0, 0), [])
  const glitchDuration = useMemo(() => new Vector2(0.2, 0.4), [])
  const glitchStrength = useMemo(() => new Vector2(0.2, 0.5), [])
  const aberration = useMemo(() => new Vector2(0.0005, 0.0009), [])

  useEffect(() => {
    if (mobile) console.log('[Effects] mobile tier — scanline overlay disabled, Bloom resolutionScale reduced to 0.4, mipmapBlur off')
  }, [mobile])

  if (quality === 'low') return null

  const bloomProps = {
    mipmapBlur: !mobile,
    intensity: 1.2,
    luminanceThreshold: BLOOM_THRESHOLD,
    luminanceSmoothing: BLOOM_SMOOTHING,
    resolutionScale: mobile ? 0.4 : 1,
  }

  // reduced-motion users who opted into 3D still get the look, minus the movement
  if (reducedMotion) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom {...bloomProps} />
        <ChromaticAberration offset={aberration} />
        <Vignette eskil={false} offset={0.18} darkness={0.82} />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom {...bloomProps} />
      <ChromaticAberration offset={aberration} />
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.5} />
      <Vignette eskil={false} offset={0.18} darkness={0.82} />
      <Glitch
        active={glitching}
        mode={GlitchMode.CONSTANT_MILD}
        delay={glitchDelay}
        duration={glitchDuration}
        strength={glitchStrength}
        ratio={0.9}
      />
    </EffectComposer>
  )
}
