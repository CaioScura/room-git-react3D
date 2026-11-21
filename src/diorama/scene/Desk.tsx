import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'
import { Monitor } from './Monitor'

export const DESK_W = 3.2 // largura (x)
export const DESK_D = 1.4 // profundidade (z)
const TOP_Y = 1.5

const legs: [number, number][] = [
  [-(DESK_W / 2 - 0.1), -(DESK_D / 2 - 0.1)],
  [DESK_W / 2 - 0.1, -(DESK_D / 2 - 0.1)],
  [-(DESK_W / 2 - 0.1), DESK_D / 2 - 0.1],
  [DESK_W / 2 - 0.1, DESK_D / 2 - 0.1],
]

export function Desk(props: { position: [number, number, number] }) {
  const legHeight = TOP_Y - 0.05

  return (
    <group position={props.position}>
      <Box size={[DESK_W, 0.1, DESK_D]} position={[0, TOP_Y, 0]} color={PALETTE.wood} radius={0.04} />
      {legs.map(([x, z], i) => (
        <Box key={i} size={[0.1, legHeight, 0.1]} position={[x, legHeight / 2, z]} color={PALETTE.woodDark} />
      ))}

      {/* fita de LED embaixo do tampo (brilho roxo nas pernas da mesa e no chão) */}
      <mesh position={[0, TOP_Y - 0.06, DESK_D / 2 - 0.05]}>
        <boxGeometry args={[DESK_W - 0.3, 0.02, 0.02]} />
        <meshBasicMaterial color={[0.7 * 2.5, 0.62 * 2.5, 0.98 * 2.5]} toneMapped={false} />
      </mesh>

      <Monitor position={[-0.1, 1.55, -0.35]} />

      {/* teclado (teclas lilás), mousepad e mouse */}
      <Box size={[1.1, 0.05, 0.36]} position={[0, 1.58, 0.4]} color="#2b2b44" radius={0.02} />
      <Box size={[1.0, 0.02, 0.28]} position={[0, 1.61, 0.4]} color={PALETTE.lilac} />
      <Box size={[0.42, 0.01, 0.36]} position={[0.72, 1.555, 0.42]} color={PALETTE.accentDeep} radius={0.004} />
      <Box size={[0.13, 0.05, 0.2]} position={[0.72, 1.58, 0.42]} color="#2b2b44" radius={0.02} />

      {/* mesa digitalizadora + caneta (o lado artista) */}
      <group position={[-1.05, 1.555, 0.32]} rotation={[0, 0.15, 0]}>
        <Box size={[0.55, 0.015, 0.38]} color="#22223a" radius={0.006} />
        <Box size={[0.42, 0.004, 0.28]} position={[0.03, 0.009, 0]} color="#3a3c66" />
        <mesh castShadow position={[0.05, 0.02, 0.05]} rotation={[0, 0.6, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.007, 0.26, 8]} />
          <meshStandardMaterial color={PALETTE.cream} />
        </mesh>
      </group>
    </group>
  )
}
