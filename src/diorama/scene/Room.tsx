import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

export const ROOM_SIZE = 7 // quarto 7x7: de -3.5 a 3.5 em X e Z
export const WALL_HEIGHT = 4.2
const HALF = ROOM_SIZE / 2

// quarto compacto: chão com tábuas + parede do fundo + parede da esquerda + LED no topo
export function Room() {
  return (
    <group>
      <Box size={[ROOM_SIZE, 0.2, ROOM_SIZE]} position={[0, -0.1, 0]} color={PALETTE.floor} />

      {/* linhas das tábuas do piso */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-HALF + i * 0.8, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.02, ROOM_SIZE]} />
          <meshStandardMaterial color={PALETTE.floorLine} />
        </mesh>
      ))}

      {/* paredes */}
      <Box size={[ROOM_SIZE, WALL_HEIGHT, 0.2]} position={[0, WALL_HEIGHT / 2, -HALF - 0.1]} color={PALETTE.wallBack} />
      <Box size={[0.2, WALL_HEIGHT, ROOM_SIZE]} position={[-HALF - 0.1, WALL_HEIGHT / 2, 0]} color={PALETTE.wallLeft} />

      {/* lambri + friso */}
      <Box size={[ROOM_SIZE, 1.0, 0.04]} position={[0, 0.5, -HALF + 0.02]} color={PALETTE.panel} />
      <Box size={[0.04, 1.0, ROOM_SIZE]} position={[-HALF + 0.02, 0.5, 0]} color={PALETTE.panel} />
      <Box size={[ROOM_SIZE, 0.05, 0.07]} position={[0, 1.02, -HALF + 0.04]} color={PALETTE.trim} />
      <Box size={[0.07, 0.05, ROOM_SIZE]} position={[-HALF + 0.04, 1.02, 0]} color={PALETTE.trim} />

      {/* rodapés */}
      <Box size={[ROOM_SIZE, 0.14, 0.07]} position={[0, 0.07, -HALF + 0.05]} color={PALETTE.trim} />
      <Box size={[0.07, 0.14, ROOM_SIZE]} position={[-HALF + 0.05, 0.07, 0]} color={PALETTE.trim} />

      {/* fita de LED no topo das paredes: cor > 1 + bloom = brilho roxo-azulado */}
      <mesh position={[0, WALL_HEIGHT - 0.06, -HALF + 0.03]}>
        <boxGeometry args={[ROOM_SIZE, 0.04, 0.04]} />
        <meshBasicMaterial color={[0.55 * 2.4, 0.55 * 2.4, 0.96 * 2.4]} toneMapped={false} />
      </mesh>
      <mesh position={[-HALF + 0.03, WALL_HEIGHT - 0.06, 0]}>
        <boxGeometry args={[0.04, 0.04, ROOM_SIZE]} />
        <meshBasicMaterial color={[0.55 * 2.4, 0.55 * 2.4, 0.96 * 2.4]} toneMapped={false} />
      </mesh>
    </group>
  )
}
