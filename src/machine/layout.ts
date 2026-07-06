import type { RoomId } from '../state/store'
import type { Rect } from '../lib/walkable'

export interface RoomDef {
  id: RoomId
  label: string
  path: string
  center: [number, number] // x, z
  size: [number, number] // width (x), depth (z)
  height: number
  accent: string
  octagon?: boolean
  /** which side its door faces (toward the hub) */
  door: 'north' | 'south' | 'east' | 'west' | null
  waypoint: [number, number]
  /** camera yaw on arrival (0 faces -z) */
  waypointYaw: number
}

export const EYE_HEIGHT = 1.6
export const DOOR_WIDTH = 3
export const DOOR_HEIGHT = 2.7
export const WALL_THICKNESS = 0.3

export const ROOMS: Record<RoomId, RoomDef> = {
  bus: {
    id: 'bus',
    label: 'FRONT BUS',
    path: '/',
    center: [0, 0],
    size: [10, 10],
    height: 4.2,
    accent: '#4da6ff',
    door: null,
    waypoint: [0, 1.5],
    waypointYaw: 0,
  },
  about: {
    id: 'about',
    label: 'CORE',
    path: '/about',
    center: [0, -26],
    size: [15, 15],
    height: 3.4,
    accent: '#39ff9c',
    octagon: true,
    door: 'south',
    waypoint: [0, -23.5],
    waypointYaw: 0,
  },
  skills: {
    id: 'skills',
    label: 'SCHEDULER',
    path: '/skills',
    center: [-27, 0],
    size: [18, 18],
    height: 6,
    accent: '#4da6ff',
    door: 'east',
    waypoint: [-25.5, 0],
    waypointYaw: Math.PI / 2,
  },
  projects: {
    id: 'projects',
    label: 'STORAGE ARRAY',
    path: '/projects',
    center: [29, 0],
    size: [26, 26],
    height: 11,
    accent: '#39ff9c',
    door: 'west',
    waypoint: [22, 0],
    waypointYaw: -Math.PI / 2,
  },
  contact: {
    id: 'contact',
    label: 'I/O PORT',
    path: '/contact',
    center: [0, 21],
    size: [11, 9],
    height: 3.6,
    accent: '#4da6ff',
    door: 'north',
    waypoint: [0, 20],
    waypointYaw: Math.PI,
  },
}

export const ROOM_ORDER: RoomId[] = ['about', 'skills', 'projects', 'contact']

export interface CorridorDef {
  room: RoomId
  axis: 'x' | 'z'
  x: [number, number]
  z: [number, number]
}

/** bus ↔ room connections, wall-to-wall */
export const CORRIDORS: CorridorDef[] = [
  { room: 'about', axis: 'z', x: [-1.5, 1.5], z: [-18.5, -5] },
  { room: 'skills', axis: 'x', x: [-18, -5], z: [-1.5, 1.5] },
  { room: 'projects', axis: 'x', x: [5, 16], z: [-1.5, 1.5] },
  { room: 'contact', axis: 'z', x: [-1.5, 1.5], z: [5, 16.5] },
]

const CORRIDOR_MARGIN = 0.4
/** corridors poke into rooms so the walkable union stays connected */
const OVERLAP = 2.8

/** octagon rooms keep the walkable square inside the angled walls */
const roomMargin = (room: RoomDef): number => (room.octagon ? room.size[0] * 0.3 : 0.7)

export const WALKABLE_ZONES: Rect[] = [
  ...Object.values(ROOMS).map((room) => ({
    minX: room.center[0] - room.size[0] / 2 + roomMargin(room),
    maxX: room.center[0] + room.size[0] / 2 - roomMargin(room),
    minZ: room.center[1] - room.size[1] / 2 + roomMargin(room),
    maxZ: room.center[1] + room.size[1] / 2 - roomMargin(room),
  })),
  ...CORRIDORS.map((corridor) =>
    corridor.axis === 'z'
      ? {
          minX: corridor.x[0] + CORRIDOR_MARGIN,
          maxX: corridor.x[1] - CORRIDOR_MARGIN,
          minZ: corridor.z[0] - OVERLAP,
          maxZ: corridor.z[1] + OVERLAP,
        }
      : {
          minX: corridor.x[0] - OVERLAP,
          maxX: corridor.x[1] + OVERLAP,
          minZ: corridor.z[0] + CORRIDOR_MARGIN,
          maxZ: corridor.z[1] - CORRIDOR_MARGIN,
        },
  ),
]

export const ROOM_RECTS: { id: RoomId; rect: Rect }[] = Object.values(ROOMS).map((room) => ({
  id: room.id,
  rect: {
    minX: room.center[0] - room.size[0] / 2,
    maxX: room.center[0] + room.size[0] / 2,
    minZ: room.center[1] - room.size[1] / 2,
    maxZ: room.center[1] + room.size[1] / 2,
  },
}))

/** midpoint of a room's corridor — travel routing node */
export function corridorMid(room: RoomId): [number, number] {
  const corridor = CORRIDORS.find((c) => c.room === room)
  if (!corridor) return ROOMS.bus.waypoint
  return [(corridor.x[0] + corridor.x[1]) / 2, (corridor.z[0] + corridor.z[1]) / 2]
}
