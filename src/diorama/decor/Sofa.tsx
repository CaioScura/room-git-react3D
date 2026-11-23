import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

const SOFA = '#4b4f9e'
const CUSHION = '#5b5fc7'

// sofá de 2 lugares; montado "de frente" para +Z (girar para encostar na parede)
export function Sofa(props: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group {...props}>
      {/* pés */}
      {[[-0.9, -0.35], [0.9, -0.35], [-0.9, 0.35], [0.9, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]}>
          <cylinderGeometry args={[0.035, 0.025, 0.14, 8]} />
          <meshStandardMaterial color={PALETTE.woodDark} />
        </mesh>
      ))}

      {/* base, encosto e braços */}
      <Box size={[2.0, 0.3, 0.9]} position={[0, 0.3, 0]} color={SOFA} radius={0.06} />
      <Box size={[2.0, 0.62, 0.22]} position={[0, 0.74, -0.34]} color={SOFA} radius={0.09} />
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.2, 0.48, 0.9]} position={[side * 0.98, 0.56, 0]} color={SOFA} radius={0.08} />
      ))}

      {/* 2 almofadas do assento */}
      {[-0.44, 0.44].map((x) => (
        <Box key={x} size={[0.86, 0.17, 0.7]} position={[x, 0.53, 0.07]} color={CUSHION} radius={0.07} />
      ))}

      {/* almofadas de enfeite encostadas, levemente tortas */}
      <Box size={[0.4, 0.38, 0.12]} position={[-0.6, 0.83, -0.16]} rotation={[-0.25, 0.1, 0.12]} color={PALETTE.pink} radius={0.06} />
      <Box size={[0.36, 0.34, 0.12]} position={[0.62, 0.81, -0.16]} rotation={[-0.25, -0.15, -0.1]} color={PALETTE.lilac} radius={0.06} />

      {/* manta caindo pelo braço direito */}
      <group position={[0.98, 0.8, 0.05]}>
        <Box size={[0.26, 0.05, 0.6]} color={PALETTE.lavender} radius={0.02} />
        <Box size={[0.05, 0.45, 0.6]} position={[0.13, -0.22, 0]} color={PALETTE.lavender} radius={0.02} />
      </group>
    </group>
  )
}
