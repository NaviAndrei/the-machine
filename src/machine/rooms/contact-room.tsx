import { Text } from '@react-three/drei'
import { CONTACT_LINKS } from '../../data/contact'
import { useMachine } from '../../state/store'
import { ROOMS } from '../layout'
import { ConsoleLink } from '../components/console-link'
import { FONT_BOLD } from '../fonts'

export function ContactRoom() {
  const room = ROOMS.contact
  const [cx, cz] = room.center
  const currentRoom = useMachine((s) => s.currentRoom)

  return (
    <group>
      <Text
        font={FONT_BOLD}
        fontSize={0.34}
        color="#4da6ff"
        anchorX="center"
        position={[cx, 2.5, cz + room.size[1] / 2 - 0.4]}
        rotation={[0, Math.PI, 0]}
      >
        /contact — I/O PORT
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.12}
        color="#5b7482"
        anchorX="center"
        position={[cx, 2.15, cz + room.size[1] / 2 - 0.4]}
        rotation={[0, Math.PI, 0]}
      >
        DIRECT LINES ONLY — NO FORMS, NO MIDDLEWARE
      </Text>

      {/* three consoles along the back wall, angled toward the door */}
      {CONTACT_LINKS.map((link, i) => {
        const x = cx + (i - 1) * 2.4
        return (
          <ConsoleLink
            key={link.id}
            link={link}
            position={[x, 0, cz + 1.6]}
            rotationY={Math.PI + (i - 1) * -0.22}
            showAnchor={currentRoom === 'contact'}
          />
        )
      })}

      {/* decorative port wall */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[cx - 3.9 + i * 1.12, 0.5, cz + room.size[1] / 2 - 0.35]}>
          <boxGeometry args={[0.6, 0.22, 0.12]} />
          <meshStandardMaterial
            color="#0d1620"
            metalness={0.8}
            roughness={0.3}
            emissive={i % 2 === 0 ? '#4da6ff' : '#39ff9c'}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}
