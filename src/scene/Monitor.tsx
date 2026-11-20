import { Box } from '../components/Box'

// monitor; o ponto do grupo fica na base (onde encosta na mesa)
export function Monitor(props: { position: [number, number, number] }) {
  return (
    <group position={props.position}>
      <Box size={[0.5, 0.04, 0.3]} position={[0, 0.02, 0]} color="#2b2b38" />   {/* pé */}
      <Box size={[0.1, 0.45, 0.08]} position={[0, 0.25, -0.02]} color="#2b2b38" /> {/* haste */}
      <Box size={[1.95, 1.18, 0.08]} position={[0, 0.82, 0]} color="#22212e" />   {/* moldura */}

      {/* tela: um plano (forma 2D) um pouco à frente da moldura */}
      <mesh position={[0, 0.82, 0.045]}>
        <planeGeometry args={[1.83, 1.07]} />
        <meshBasicMaterial color="#1d1b2b" />
      </mesh>
    </group>
  )
}