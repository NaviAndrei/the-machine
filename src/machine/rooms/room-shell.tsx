import { useMemo } from 'react'
import {
  DOOR_HEIGHT,
  DOOR_WIDTH,
  WALL_THICKNESS as T,
  type CorridorDef,
  type RoomDef,
} from '../layout'
import { matCeiling, matSlab, matWall, stripFor } from '../materials'

type Side = 'north' | 'south' | 'east' | 'west'

interface BoxSpec {
  pos: [number, number, number]
  size: [number, number, number]
}

/** walls for one side of a rect room, split around a centered door gap */
function sideWalls(room: RoomDef, side: Side, hasDoor: boolean): BoxSpec[] {
  const [cx, cz] = room.center
  const [w, d] = room.size
  const h = room.height
  const horizontal = side === 'north' || side === 'south'
  const length = horizontal ? w : d
  const wallX = side === 'east' ? cx + w / 2 : side === 'west' ? cx - w / 2 : cx
  const wallZ = side === 'north' ? cz - d / 2 : side === 'south' ? cz + d / 2 : cz

  if (!hasDoor) {
    return [
      {
        pos: [wallX, h / 2, wallZ],
        size: horizontal ? [length, h, T] : [T, h, length],
      },
    ]
  }

  const seg = (length - DOOR_WIDTH) / 2
  const offset = DOOR_WIDTH / 2 + seg / 2
  const specs: BoxSpec[] = horizontal
    ? [
        { pos: [cx - offset, h / 2, wallZ], size: [seg, h, T] },
        { pos: [cx + offset, h / 2, wallZ], size: [seg, h, T] },
      ]
    : [
        { pos: [wallX, h / 2, cz - offset], size: [T, h, seg] },
        { pos: [wallX, h / 2, cz + offset], size: [T, h, seg] },
      ]
  // lintel above the door
  const lintelH = h - DOOR_HEIGHT
  if (lintelH > 0.05) {
    specs.push({
      pos: [wallX, DOOR_HEIGHT + lintelH / 2, wallZ],
      size: horizontal ? [DOOR_WIDTH, lintelH, T] : [T, lintelH, DOOR_WIDTH],
    })
  }
  return specs
}

export function RectRoomShell({ room, doors }: { room: RoomDef; doors: Side[] }) {
  const [cx, cz] = room.center
  const [w, d] = room.size
  const h = room.height
  const strip = stripFor(room.accent)

  const walls = useMemo(
    () =>
      (['north', 'south', 'east', 'west'] as Side[]).flatMap((side) =>
        sideWalls(room, side, doors.includes(side)),
      ),
    [room, doors],
  )

  return (
    <group>
      {/* raised floor slab */}
      <mesh position={[cx, 0.03, cz]} material={matSlab}>
        <boxGeometry args={[w, 0.06, d]} />
      </mesh>
      {/* ceiling */}
      <mesh position={[cx, h, cz]} material={matCeiling}>
        <boxGeometry args={[w, 0.12, d]} />
      </mesh>
      {walls.map((wall, i) => (
        <mesh key={i} position={wall.pos} material={matWall}>
          <boxGeometry args={wall.size} />
        </mesh>
      ))}
      {/* cove light strips near the ceiling on every wall */}
      <mesh position={[cx, h - 0.32, cz - d / 2 + T]} material={strip}>
        <boxGeometry args={[w * 0.9, 0.05, 0.05]} />
      </mesh>
      <mesh position={[cx, h - 0.32, cz + d / 2 - T]} material={strip}>
        <boxGeometry args={[w * 0.9, 0.05, 0.05]} />
      </mesh>
      <mesh position={[cx - w / 2 + T, h - 0.32, cz]} material={strip}>
        <boxGeometry args={[0.05, 0.05, d * 0.9]} />
      </mesh>
      <mesh position={[cx + w / 2 - T, h - 0.32, cz]} material={strip}>
        <boxGeometry args={[0.05, 0.05, d * 0.9]} />
      </mesh>
      {/* room key light */}
      <pointLight
        position={[cx, h - 0.6, cz]}
        color={room.accent}
        intensity={Math.max(w, d) * 4}
        distance={Math.max(w, d) * 1.6}
        decay={1.8}
      />
    </group>
  )
}

/** eight-sided chamber; one side (facing the door) stays open */
export function OctagonRoomShell({ room }: { room: RoomDef }) {
  const [cx, cz] = room.center
  const apothem = room.size[0] / 2
  const h = room.height
  const panelWidth = 2 * apothem * Math.tan(Math.PI / 8)
  const strip = stripFor(room.accent)

  const panels = useMemo(() => {
    const list: { pos: [number, number, number]; rotY: number }[] = []
    for (let k = 1; k < 8; k++) {
      // k = 0 (azimuth 0, facing +z / the corridor) stays open
      const theta = k * (Math.PI / 4)
      list.push({
        pos: [cx + apothem * Math.sin(theta), h / 2, cz + apothem * Math.cos(theta)],
        rotY: theta,
      })
    }
    return list
  }, [cx, cz, apothem, h])

  return (
    <group>
      <mesh position={[cx, 0.03, cz]} material={matSlab}>
        <cylinderGeometry args={[apothem / Math.cos(Math.PI / 8), apothem / Math.cos(Math.PI / 8), 0.06, 8]} />
      </mesh>
      <mesh position={[cx, h, cz]} material={matCeiling}>
        <cylinderGeometry args={[apothem / Math.cos(Math.PI / 8), apothem / Math.cos(Math.PI / 8), 0.12, 8]} />
      </mesh>
      {panels.map((panel, i) => (
        <group key={i} position={panel.pos} rotation={[0, panel.rotY, 0]}>
          <mesh material={matWall}>
            <boxGeometry args={[panelWidth, h, T]} />
          </mesh>
          <mesh position={[0, h / 2 - 0.32, -T]} material={strip}>
            <boxGeometry args={[panelWidth * 0.86, 0.05, 0.05]} />
          </mesh>
        </group>
      ))}
      <pointLight
        position={[cx, h - 0.5, cz]}
        color={room.accent}
        intensity={apothem * 6}
        distance={apothem * 3.4}
        decay={1.8}
      />
    </group>
  )
}

export function Corridor({ corridor, accent }: { corridor: CorridorDef; accent: string }) {
  const strip = stripFor(accent)
  const midX = (corridor.x[0] + corridor.x[1]) / 2
  const midZ = (corridor.z[0] + corridor.z[1]) / 2
  const lenX = corridor.x[1] - corridor.x[0]
  const lenZ = corridor.z[1] - corridor.z[0]
  const alongX = corridor.axis === 'x'
  const length = alongX ? lenX : lenZ
  const width = alongX ? lenZ : lenX

  return (
    <group>
      {/* side walls */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={
            alongX
              ? [midX, DOOR_HEIGHT / 2, midZ + (side * width) / 2]
              : [midX + (side * width) / 2, DOOR_HEIGHT / 2, midZ]
          }
          material={matWall}
        >
          <boxGeometry args={alongX ? [length, DOOR_HEIGHT, T] : [T, DOOR_HEIGHT, length]} />
        </mesh>
      ))}
      {/* ceiling */}
      <mesh position={[midX, DOOR_HEIGHT, midZ]} material={matCeiling}>
        <boxGeometry args={alongX ? [length, 0.1, width] : [width, 0.1, length]} />
      </mesh>
      {/* top edge light strips */}
      {[-1, 1].map((side) => (
        <mesh
          key={`strip-${side}`}
          position={
            alongX
              ? [midX, DOOR_HEIGHT - 0.16, midZ + side * (width / 2 - 0.12)]
              : [midX + side * (width / 2 - 0.12), DOOR_HEIGHT - 0.16, midZ]
          }
          material={strip}
        >
          <boxGeometry args={alongX ? [length, 0.04, 0.04] : [0.04, 0.04, length]} />
        </mesh>
      ))}
      {/* floor data-trace */}
      <mesh position={[midX, 0.02, midZ]} material={strip}>
        <boxGeometry args={alongX ? [length, 0.02, 0.1] : [0.1, 0.02, length]} />
      </mesh>
    </group>
  )
}
