export type Mode = '3d' | '2d'

const MODE_KEY = 'machine:mode'

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let webglResult: boolean | null = null

/** WebGL2 present and not a software rasterizer */
export function webglCapable(): boolean {
  if (webglResult !== null) return webglResult
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return (webglResult = false)
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    if (info) {
      const renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)).toLowerCase()
      if (/swiftshader|llvmpipe|software|basic render/.test(renderer)) return (webglResult = false)
    }
    return (webglResult = true)
  } catch {
    return (webglResult = false)
  }
}

export function isMobileLike(): boolean {
  return (
    window.matchMedia('(pointer: coarse)').matches &&
    Math.min(window.innerWidth, window.innerHeight) < 900
  )
}

export function lowSpecDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || navigator.hardwareConcurrency <= 3
}

export function storeModePreference(mode: Mode): void {
  try {
    localStorage.setItem(MODE_KEY, mode)
  } catch {
    /* storage unavailable — preference just won't persist */
  }
}

/**
 * Explicit user choice wins; otherwise reduced-motion, mobile-class devices
 * and machines without hardware WebGL2 get the 2D experience.
 */
export function detectMode(): Mode {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(MODE_KEY)
  } catch {
    /* ignore */
  }
  if (stored === '3d' && webglCapable()) return '3d'
  if (stored === '2d') return '2d'
  if (prefersReducedMotion() || isMobileLike() || !webglCapable()) return '2d'
  return '3d'
}
