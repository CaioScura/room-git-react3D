import { Box } from '../components/Box'

// cadeira de escritório; o ponto (0,0,0) do grupo fica no chão, no centro da cadeira
export function Chair(props: { position: [number, number, number] }) {
  return (
    <group position={props.position}>
      {/* assento */}
      <Box size={[0.95, 0.12, 0.9]} position={[0, 0.95, 0]} color="#3a3a4a" />
      {/* encosto: atrás do assento (z positivo = em direção à frente do quarto) */}
      <Box size={[0.95, 1.15, 0.12]} position={[0, 1.6, 0.48]} color="#3a3a4a" />

      {/* coluna: cylinderGeometry args = [raio topo, raio base, altura, lados] */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.9, 10]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* base em "+" feita com duas caixas cruzadas */}
      <Box size={[0.9, 0.06, 0.12]} position={[0, 0.03, 0]} color="#222" />
      <Box size={[0.12, 0.06, 0.9]} position={[0, 0.03, 0]} color="#222" />
    </group>
  )
}