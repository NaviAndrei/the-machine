import { Color, MeshBasicMaterial, MeshStandardMaterial } from 'three'

// Shared singletons — one program per surface family keeps draw state cheap.

export const matWall = new MeshStandardMaterial({
  color: new Color('#0d1620'),
  metalness: 0.65,
  roughness: 0.45,
})

export const matSlab = new MeshStandardMaterial({
  color: new Color('#0a1017'),
  metalness: 0.5,
  roughness: 0.55,
})

export const matCeiling = new MeshStandardMaterial({
  color: new Color('#060b10'),
  metalness: 0.4,
  roughness: 0.7,
})

export const matPanel = new MeshStandardMaterial({
  color: new Color('#0a141c'),
  metalness: 0.8,
  roughness: 0.3,
})

export const matDark = new MeshStandardMaterial({
  color: new Color('#04070a'),
  metalness: 0.3,
  roughness: 0.8,
})

// multiplied above the Bloom luminanceThreshold (1.05) — see CLAUDE.md rule 2
export const stripNeon = new MeshBasicMaterial({ color: new Color('#39ff9c').multiplyScalar(2.0) })
export const stripVolt = new MeshBasicMaterial({ color: new Color('#4da6ff').multiplyScalar(2.0) })

export function stripFor(accent: string): MeshBasicMaterial {
  return accent === '#39ff9c' ? stripNeon : stripVolt
}
