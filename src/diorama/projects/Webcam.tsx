import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { useDiorama } from '../context'

// webcam em cima do monitor; a origem fica na base (apoiada na moldura)
export function Webcam() {
  const { hovered } = useDiorama()
  const on = hovered === 'expression'

  return (
    <Hotspot id="expression" label="Expression Lab" position={[-0.3, 2.96, -3.15]} labelOffset={[0, 0.5, 0]}>
      <Box size={[0.34, 0.16, 0.16]} position={[0, 0.08, 0]} color="#1f1f29" radius={0.04} />
      <mesh position={[0, 0.08, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#4b5bd6" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* LED: com cor acima de 1, o bloom faz ele "brilhar" de verdade */}
      <mesh position={[0.12, 0.08, 0.085]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color={on ? [0.6, 3, 1.2] : [0.5, 0.08, 0.08]} toneMapped={false} />
      </mesh>
    </Hotspot>
  )
}
