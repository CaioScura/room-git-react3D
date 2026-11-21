import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'
import { Succulent } from './Plants'

// mesinha de centro na frente do sofá: livros, vela acesa, caderno de desenho e plantinha
export function CoffeeTable({ position }: { position: [number, number, number] }) {
  const flame = useRef<THREE.Mesh>(null!)

  // chama da vela tremulando: escala "nervosa" com dois senos de velocidades diferentes
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flicker = 1 + Math.sin(t * 13) * 0.08 + Math.sin(t * 29) * 0.05
    flame.current.scale.set(1, flicker, 1)
  })

  return (
    <group position={position}>
      <Box size={[0.7, 0.05, 1.1]} position={[0, 0.42, 0]} color={PALETTE.wood} radius={0.025} />
      {[[-0.28, -0.48], [0.28, -0.48], [-0.28, 0.48], [0.28, 0.48]].map(([x, z], i) => (
        <Box key={i} size={[0.05, 0.4, 0.05]} position={[x, 0.2, z]} color={PALETTE.woodDark} />
      ))}

      {/* pilha de livros */}
      {[PALETTE.accentDeep, PALETTE.pink].map((color, i) => (
        <Box key={i} size={[0.36, 0.06, 0.26]} position={[0.05, 0.475 + i * 0.06, -0.28]} rotation={[0, i * 0.25, 0]} color={color} radius={0.012} />
      ))}

      {/* caderno de desenho aberto + lápis */}
      <group position={[0.02, 0.45, 0.18]} rotation={[0, -0.3, 0]}>
        <Box size={[0.42, 0.012, 0.3]} color={PALETTE.cream} radius={0.004} />
        <Box size={[0.006, 0.014, 0.3]} color="#b8b6e8" />
        <mesh position={[0.1, 0.012, 0.02]} rotation={[0, 0.5, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
          <meshStandardMaterial color={PALETTE.accent} />
        </mesh>
      </group>

      {/* vela: cilindro + chama brilhante (cor > 1 = bloom) */}
      <group position={[-0.18, 0.445, 0.4]}>
        <mesh castShadow position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 14]} />
          <meshStandardMaterial color={PALETTE.lavender} />
        </mesh>
        <mesh ref={flame} position={[0, 0.15, 0]}>
          <coneGeometry args={[0.018, 0.06, 8]} />
          <meshBasicMaterial color={[3, 1.9, 1.1]} toneMapped={false} />
        </mesh>
      </group>

      <Succulent position={[-0.18, 0.445, -0.05]} potColor={PALETTE.pink} />
    </group>
  )
}
