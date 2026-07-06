import type { RoomId } from '../state/store'

export const ROOM_HASH: Record<RoomId, string> = {
  bus: '#/',
  about: '#/about',
  projects: '#/projects',
  skills: '#/skills',
  contact: '#/contact',
}

const HASH_ROOM: Record<string, RoomId> = {
  '#/': 'bus',
  '#/about': 'about',
  '#/projects': 'projects',
  '#/skills': 'skills',
  '#/contact': 'contact',
}

export function roomFromHash(): RoomId | null {
  return HASH_ROOM[window.location.hash] ?? null
}

export function updateHash(room: RoomId): void {
  history.replaceState(null, '', ROOM_HASH[room])
}

/** 2D fallback: `#/about` → element id `about` */
export function sectionIdFromHash(): string | null {
  const room = roomFromHash()
  return room && room !== 'bus' ? room : null
}
