export interface Rect {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export const rectContains = (rect: Rect, x: number, z: number): boolean =>
  x >= rect.minX && x <= rect.maxX && z >= rect.minZ && z <= rect.maxZ

const insideAny = (zones: Rect[], x: number, z: number): boolean =>
  zones.some((zone) => rectContains(zone, x, z))

/**
 * Clamp a proposed move to the union of walkable rectangles.
 * Falls back to axis-separated moves so the player slides along walls
 * instead of sticking to them.
 */
export function clampToZones(
  zones: Rect[],
  prevX: number,
  prevZ: number,
  nextX: number,
  nextZ: number,
): { x: number; z: number } {
  if (insideAny(zones, nextX, nextZ)) return { x: nextX, z: nextZ }
  if (insideAny(zones, nextX, prevZ)) return { x: nextX, z: prevZ }
  if (insideAny(zones, prevX, nextZ)) return { x: prevX, z: nextZ }
  return { x: prevX, z: prevZ }
}
