import { useEffect, useRef, type KeyboardEvent } from 'react'
import { playerState, useMachine, type RoomId } from '../state/store'
import { CORRIDORS, ROOMS, ROOM_ORDER } from '../machine/layout'

// world → map: x ∈ [-40, 46], z ∈ [-37, 29]
const SCALE = 1.9
const mapX = (x: number) => (x + 40) * SCALE
const mapY = (z: number) => (z + 37) * SCALE
const W = 86 * SCALE
const H = 66 * SCALE

function octagonPoints(cx: number, cz: number, apothem: number): string {
  const r = apothem / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, k) => {
    const theta = Math.PI / 8 + k * (Math.PI / 4)
    return `${mapX(cx + r * Math.sin(theta))},${mapY(cz + r * Math.cos(theta))}`
  }).join(' ')
}

export function MiniMap() {
  const currentRoom = useMachine((s) => s.currentRoom)
  const requestTravel = useMachine((s) => s.requestTravel)
  const dotRef = useRef<SVGGElement>(null)

  // player marker follows the frame loop on its own rAF — no React re-renders
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (dotRef.current) {
        const deg = (-playerState.yaw * 180) / Math.PI
        dotRef.current.setAttribute(
          'transform',
          `translate(${mapX(playerState.x)}, ${mapY(playerState.z)}) rotate(${deg})`,
        )
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const travel = (room: RoomId) => () => requestTravel(room)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="group"
      aria-label="Machine map — click a room to travel"
      className="h-auto w-[34vw] min-w-[130px] max-w-[163px] border border-panel-2 bg-void/80 backdrop-blur"
    >
      {/* corridors */}
      {CORRIDORS.map((corridor) => (
        <line
          key={corridor.room}
          x1={mapX((corridor.x[0] + corridor.x[1]) / 2 - (corridor.axis === 'x' ? (corridor.x[1] - corridor.x[0]) / 2 : 0))}
          y1={mapY((corridor.z[0] + corridor.z[1]) / 2 - (corridor.axis === 'z' ? (corridor.z[1] - corridor.z[0]) / 2 : 0))}
          x2={mapX((corridor.x[0] + corridor.x[1]) / 2 + (corridor.axis === 'x' ? (corridor.x[1] - corridor.x[0]) / 2 : 0))}
          y2={mapY((corridor.z[0] + corridor.z[1]) / 2 + (corridor.axis === 'z' ? (corridor.z[1] - corridor.z[0]) / 2 : 0))}
          stroke="#1a2f3d"
          strokeWidth={4}
        />
      ))}

      {/* rooms (clickable) */}
      {(['bus', ...ROOM_ORDER] as RoomId[]).map((id) => {
        const room = ROOMS[id]
        const active = id === currentRoom
        const stroke = active ? room.accent : '#2a4152'
        const common = {
          fill: active ? `${room.accent}22` : '#0a141c',
          stroke,
          strokeWidth: 1.5,
          className: 'cursor-pointer transition-colors motion-reduce:transition-none hover:stroke-neon active:stroke-neon focus:outline-none',
          tabIndex: 0,
          role: 'button',
          'aria-label': `Travel to ${room.path === '/' ? 'front bus' : room.path}`,
          onClick: travel(id),
          onKeyDown: (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') requestTravel(id)
          },
        }
        return room.octagon ? (
          <polygon key={id} points={octagonPoints(room.center[0], room.center[1], room.size[0] / 2)} {...common} />
        ) : (
          <rect
            key={id}
            x={mapX(room.center[0] - room.size[0] / 2)}
            y={mapY(room.center[1] - room.size[1] / 2)}
            width={room.size[0] * SCALE}
            height={room.size[1] * SCALE}
            {...common}
          />
        )
      })}

      {/* labels */}
      {ROOM_ORDER.map((id) => {
        const room = ROOMS[id]
        return (
          <text
            key={id}
            x={mapX(room.center[0])}
            y={mapY(room.center[1]) + 2.5}
            textAnchor="middle"
            fontSize={7}
            fill={id === currentRoom ? room.accent : '#5b7482'}
            className="pointer-events-none select-none font-mono"
          >
            {room.path}
          </text>
        )
      })}

      {/* player marker (triangle points toward facing direction) */}
      <g ref={dotRef}>
        <polygon points="0,-5 3.4,3.4 0,1.6 -3.4,3.4" fill="#39ff9c" />
      </g>

      {/* compass */}
      <text x={W - 10} y={12} textAnchor="middle" fontSize={8} fill="#5b7482" className="select-none font-mono">
        N
      </text>
      <text x={W - 10} y={22} textAnchor="middle" fontSize={8} fill="#2a4152" className="select-none font-mono">
        ▲
      </text>
    </svg>
  )
}
