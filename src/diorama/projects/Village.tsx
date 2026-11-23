import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { PALETTE } from '../utils/palette'

const AWS_ORANGE = '#FF9900'
const AWS_DARK = '#232F3E'
const AWS_BLUE = '#146EB4'

const HOUSES = [
  { x: -0.55, height: 0.32, wall: AWS_ORANGE, roof: AWS_DARK },
  { x: 0, height: 0.45, wall: AWS_DARK, roof: AWS_ORANGE },
  { x: 0.55, height: 0.28, wall: AWS_BLUE, roof: AWS_ORANGE },
]

const SHELF_TOP = 0.04

export function Village() {
  const cloud = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    cloud.current.position.y = 0.95 + Math.sin(t * 1.5) * 0.06
    cloud.current.position.x = Math.sin(t * 0.5) * 0.25
  })

  return (
    // prateleira na parede da esquerda (onde ficava o neon "</>"), girada para olhar para dentro do quarto
    // escala 0.8: prateleira menor para o quarto compacto
    <group position={[-3.27, 2.7, -1.7]} rotation={[0, Math.PI / 2, 0]} scale={0.8}>
    <Hotspot id="vila" label="Vila Nuvem" labelOffset={[0, 1.45, 0]}>
      <Box size={[1.9, 0.08, 0.5]} color={PALETTE.wood} radius={0.02} />
      <Box size={[0.06, 0.25, 0.3]} position={[-0.75, -0.16, -0.05]} color={PALETTE.woodDark} />
      <Box size={[0.06, 0.25, 0.3]} position={[0.75, -0.16, -0.05]} color={PALETTE.woodDark} />

      {HOUSES.map((house, i) => (
        <group key={i} position={[house.x, SHELF_TOP, 0]}>
          <Box size={[0.32, house.height, 0.3]} position={[0, house.height / 2, 0]} color={house.wall} />
          <mesh castShadow position={[0, house.height + 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.26, 0.2, 4]} />
            <meshStandardMaterial color={house.roof} />
          </mesh>
        </group>
      ))}

      <group ref={cloud}>
        {[
          { x: -0.14, y: 0, r: 0.13 },
          { x: 0.04, y: 0.05, r: 0.17 },
          { x: 0.2, y: 0, r: 0.12 },
        ].map((puff, i) => (
          <mesh key={i} position={[puff.x, puff.y, 0]}>
            <sphereGeometry args={[puff.r, 14, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </Hotspot>
    </group>
  )
}
