import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { useDiorama } from '../context'

// webcam em cima do monitor; a origem fica na base (apoiada na moldura)
export function Webcam() {
  const { hovered } = useDiorama()
  const on = hovered === 'expression' // muda raramente: pode ser direto no JSX

  return (
    <Hotspot id="expression" label="Expression Lab" position={[0.4, 2.96, -4.35]} labelOffset={[0, 0.5, 0]}>
      {/* corpo */}
      <Box size={[0.34, 0.16, 0.16]} position={[0, 0.08, 0]} color="#1f1f29" />

      {/* lente: o cilindro nasce "em pé" (eixo Y); girando 90° em X ele aponta para a frente (Z) */}
      <mesh position={[0, 0.08, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#4b5bd6" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* LED: Basic + toneMapped false = parece aceso de verdade */}
      <mesh position={[0.12, 0.08, 0.085]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color={on ? '#4ade80' : '#7f1d1d'} toneMapped={false} />
      </mesh>
    </Hotspot>
  )
}