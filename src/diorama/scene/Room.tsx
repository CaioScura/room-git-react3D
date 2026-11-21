import { Box } from '../components/Box'

// quarto de 10x10: chão + parede do fundo + parede da esquerda
export function Room() {
  return (
    <group>
      <Box size={[10, 0.2, 10]} position={[0, -0.1, 0]} color="#c99a6e" />
      <Box size={[10, 5, 0.2]} position={[0, 2.5, -5.1]} color="#efe0cb" />
      <Box size={[0.2, 5, 10]} position={[-5.1, 2.5, 0]} color="#e7d4bb" />
    </group>
  )
}