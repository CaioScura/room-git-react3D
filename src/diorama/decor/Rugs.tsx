import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

// tapetes: um redondo embaixo da cadeira e um retangular na frente do sofá
export function Rugs() {
  return (
    <group>
      <mesh position={[-0.2, 0.012, -1.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.35, 48]} />
        <meshStandardMaterial color="#3d3f7a" roughness={1} />
      </mesh>
      <mesh position={[-0.2, 0.014, -1.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.05, 1.15, 48]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={1} />
      </mesh>

      {/* retangular felpudo, levemente torto (fica mais natural) */}
      <group position={[-2.0, 0, 0.9]} rotation={[0, 0.06, 0]}>
        <Box size={[1.6, 0.03, 2.3]} position={[0, 0.015, 0]} color={PALETTE.lavender} radius={0.012} />
        {[-0.75, 0, 0.75].map((z) => (
          <Box key={z} size={[1.45, 0.032, 0.1]} position={[0, 0.016, z]} color={PALETTE.lilac} />
        ))}
      </group>
    </group>
  )
}
