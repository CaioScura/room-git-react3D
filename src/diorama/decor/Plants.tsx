import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { seededRandom } from '../utils/random'
import { PALETTE } from '../utils/palette'

const LEAF = PALETTE.leaf
const LEAF_DARK = PALETTE.leafDark
const POT = PALETTE.lavender

type Vec3 = [number, number, number]

// vaso de cerâmica (cilindro mais largo em cima) com uma "borda"
function Pot({ radius, height, color = POT }: { radius: number; height: number; color?: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 0.78, height, 18]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, height, 0]}>
        <torusGeometry args={[radius, radius * 0.12, 6, 18]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* terra */}
      <mesh position={[0, height - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.95, 18]} />
        <meshStandardMaterial color="#4a3222" />
      </mesh>
    </group>
  )
}

// planta grande de chão: folhas = esferas achatadas espalhadas em volta de hastes
export function FloorPlant({ position, scale = 1, potColor = POT }: { position: Vec3; scale?: number; potColor?: string }) {
  const group = useRef<THREE.Group>(null!)
  const random = seededRandom(7)
  const leaves = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 * 1.7 // espiral: as folhas não ficam alinhadas
    const height = 0.9 + random() * 1.3
    const reach = 0.15 + random() * 0.35
    return {
      position: [Math.cos(angle) * reach, height, Math.sin(angle) * reach] as Vec3,
      rotation: [Math.sin(angle) * 0.9, -angle, Math.cos(angle) * 0.6] as Vec3,
      size: 0.16 + random() * 0.08,
      color: i % 3 ? LEAF : LEAF_DARK,
    }
  })

  // balanço levinho, como se tivesse um ventinho da janela
  useFrame((state) => {
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.02
  })

  return (
    <group position={position} scale={scale}>
      <Pot radius={0.35} height={0.6} color={potColor} />
      <group ref={group}>
        {leaves.map((leaf, i) => (
          <mesh key={i} castShadow position={leaf.position} rotation={leaf.rotation} scale={[1, 0.18, 0.6]}>
            <sphereGeometry args={[leaf.size * 1.6, 10, 8]} />
            <meshStandardMaterial color={leaf.color} roughness={0.7} />
          </mesh>
        ))}
        {/* hastes */}
        {leaves.slice(0, 6).map((leaf, i) => (
          <mesh key={i} position={[leaf.position[0] / 2, (leaf.position[1] + 0.6) / 2, leaf.position[2] / 2]}>
            <cylinderGeometry args={[0.012, 0.015, leaf.position[1] - 0.5, 5]} />
            <meshStandardMaterial color={LEAF_DARK} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// planta pendurada: vaso preso por cordinhas + ramos de folhinhas caindo
export function HangingPlant({ position, hookHeight = 0.6 }: { position: Vec3; hookHeight?: number }) {
  const vines = useRef<THREE.Group>(null!)
  const random = seededRandom(21)
  const strands = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2
    const length = 4 + Math.floor(random() * 5) // nº de folhinhas no ramo
    return { angle, length }
  })

  useFrame((state) => {
    vines.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08
  })

  return (
    <group position={position}>
      {/* 3 cordinhas indo do vaso até o gancho */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.1, 0.22 + hookHeight / 2, Math.sin(a) * 0.1]} rotation={[Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15]}>
            <cylinderGeometry args={[0.005, 0.005, hookHeight + 0.1, 4]} />
            <meshStandardMaterial color={PALETTE.lavender} />
          </mesh>
        )
      })}
      <Pot radius={0.2} height={0.24} color={PALETTE.lilac} />
      <group ref={vines}>
        {strands.map((strand, i) =>
          Array.from({ length: strand.length }).map((_, j) => {
            // cada folhinha desce um pouco e se afasta do vaso: um ramo caindo
            const out = 0.18 + j * 0.03
            return (
              <mesh
                key={`${i}-${j}`}
                castShadow
                position={[Math.cos(strand.angle) * out, 0.2 - j * 0.13, Math.sin(strand.angle) * out]}
                rotation={[j * 0.4, strand.angle, 0.5]}
                scale={[1, 0.3, 0.7]}
              >
                <sphereGeometry args={[0.06, 8, 6]} />
                <meshStandardMaterial color={j % 2 ? LEAF : LEAF_DARK} />
              </mesh>
            )
          }),
        )}
      </group>
    </group>
  )
}

// suculenta pequena: roseta de folhinhas gordinhas
export function Succulent({ position, potColor = PALETTE.cream }: { position: Vec3; potColor?: string }) {
  return (
    <group position={position}>
      <Pot radius={0.1} height={0.13} color={potColor} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const inner = i % 2 === 0
        return (
          <mesh
            key={i}
            castShadow
            position={[Math.cos(angle) * (inner ? 0.03 : 0.06), 0.18, Math.sin(angle) * (inner ? 0.03 : 0.06)]}
            rotation={[Math.sin(angle) * 0.8, 0, -Math.cos(angle) * 0.8]}
          >
            <coneGeometry args={[0.03, 0.11, 6]} />
            <meshStandardMaterial color={inner ? '#86c08a' : '#6aa87a'} />
          </mesh>
        )
      })}
    </group>
  )
}

// espada-de-são-jorge: folhas compridas e retas, em pé, saindo de um vaso alto
export function SnakePlant({ position, potColor = PALETTE.accentDeep }: { position: Vec3; potColor?: string }) {
  const random = seededRandom(33)
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const angle = (i / 9) * Math.PI * 2 * 1.3
    return {
      x: Math.cos(angle) * 0.1,
      z: Math.sin(angle) * 0.1,
      height: 0.7 + random() * 0.6,
      tiltX: Math.sin(angle) * 0.18,
      tiltZ: -Math.cos(angle) * 0.18,
      spin: angle,
    }
  })

  return (
    <group position={position}>
      <Pot radius={0.24} height={0.45} color={potColor} />
      {leaves.map((leaf, i) => (
        // a folha é uma esfera bem esticada e achatada; a base fica dentro do vaso
        <mesh
          key={i}
          castShadow
          position={[leaf.x, 0.42 + leaf.height / 2, leaf.z]}
          rotation={[leaf.tiltX, leaf.spin, leaf.tiltZ]}
          scale={[0.07, leaf.height / 2, 0.02]}
        >
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={i % 2 ? '#5aa37f' : '#3f7f60'} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
