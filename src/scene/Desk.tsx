import { Box } from '../components/Box'
import { Monitor } from './Monitor'

// medidas do tampo, para calcular a posição das pernas
const W = 4.3   // largura (x)
const D = 1.7   // profundidade (z)
const TOP_Y = 1.5

// posição das 4 pernas: um pouco para dentro das bordas
const legs: [number, number][] = [
  [-(W / 2 - 0.1), -(D / 2 - 0.1)],
  [ (W / 2 - 0.1), -(D / 2 - 0.1)],
  [-(W / 2 - 0.1),  (D / 2 - 0.1)],
  [ (W / 2 - 0.1),  (D / 2 - 0.1)],
]

export function Desk(props: { position: [number, number, number] }) {
  // a perna vai do chão (0) até embaixo do tampo (1.5 - metade da espessura 0.05)
  const legHeight = TOP_Y - 0.05

  return (
    <group position={props.position}>
      <Box size={[W, 0.1, D]} position={[0, TOP_Y, 0]} color="#8b5e3c" />

      {legs.map(([x, z], i) => (
        <Box key={i} size={[0.1, legHeight, 0.1]} position={[x, legHeight / 2, z]} color="#5a3b25" />
      ))}

      {/* em cima do tampo: y = 1.5 + 0.05 (metade da espessura) = 1.55 */}
      <Monitor position={[0, 1.55, -0.4]} />

      {/* teclado (com as teclas numa caixa mais clara por cima) e mouse */}
      <Box size={[1.1, 0.05, 0.36]} position={[0, 1.58, 0.6]} color="#2b2b38" />
      <Box size={[1.0, 0.02, 0.28]} position={[0, 1.61, 0.6]} color="#3d3d52" />
      <Box size={[0.14, 0.05, 0.22]} position={[0.85, 1.58, 0.6]} color="#2b2b38" />
    </group>
  )
}