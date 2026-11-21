import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

// cadeira de escritório com uma manta jogada no encosto
export function Chair(props: { position: [number, number, number] }) {
  return (
    <group position={props.position}>
      <Box size={[0.95, 0.12, 0.9]} position={[0, 0.95, 0]} color="#3d3f7a" radius={0.05} />
      <Box size={[0.95, 1.15, 0.12]} position={[0, 1.6, 0.48]} color="#3d3f7a" radius={0.05} />

      {/* coluna: cylinderGeometry args = [raio topo, raio base, altura, lados] */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.9, 10]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Box size={[0.9, 0.06, 0.12]} position={[0, 0.03, 0]} color="#222" />
      <Box size={[0.12, 0.06, 0.9]} position={[0, 0.03, 0]} color="#222" />

      {/* manta: uma faixa sobre o topo do encosto + a parte que cai para trás, com listras */}
      <group position={[0, 2.12, 0.48]}>
        <Box size={[0.7, 0.08, 0.2]} color={PALETTE.lavender} radius={0.03} />
        <Box size={[0.7, 0.7, 0.06]} position={[0, -0.36, 0.1]} color={PALETTE.lavender} radius={0.03} />
        {[-0.2, -0.45].map((y) => (
          <Box key={y} size={[0.71, 0.06, 0.065]} position={[0, y, 0.1]} color={PALETTE.accentDeep} />
        ))}
      </group>
    </group>
  )
}
