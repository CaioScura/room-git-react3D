import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from '../components/Hotspot'
import { getPomodoro } from '../utils/pomodoro'

const LEAVES = 5

export function Tomato(props: { position: [number, number, number] }) {
  const shakeRef = useRef<THREE.Group>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!) // ref também funciona em materiais

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const { isBreak } = getPomodoro(t)

    // pausa: balança rápido de um lado para o outro; foco: parado
    shakeRef.current.rotation.z = isBreak ? Math.sin(t * 40) * 0.12 : 0

    // brilho oscilando entre 0.15 e 0.45
    materialRef.current.emissiveIntensity = 0.3 + Math.sin(t * 2.5) * 0.15
  })

  return (
    <Hotspot id="pomomates" label="Pomomates" position={props.position} labelOffset={[0, 0.95, 0]}>
      {/* anel fica FORA do grupo que treme */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.44, 32]} />
        <meshBasicMaterial color="#ffb4a8" transparent opacity={0.7} />
      </mesh>

      <group ref={shakeRef}>
        <mesh castShadow position={[0, 0.27, 0]} scale={[1, 0.85, 1]}>
          <sphereGeometry args={[0.32, 24, 18]} />
          <meshStandardMaterial ref={materialRef} color="#e5483b" emissive="#ff3b2b" roughness={0.4} />
        </mesh>

        {Array.from({ length: LEAVES }).map((_, i) => {
          const angle = (i / LEAVES) * Math.PI * 2
          return (
            <mesh
              key={i}
              castShadow
              position={[Math.cos(angle) * 0.1, 0.53, Math.sin(angle) * 0.1]}
              rotation={[Math.sin(angle) * 0.9, 0, -Math.cos(angle) * 0.9]}
            >
              <coneGeometry args={[0.04, 0.18, 4]} />
              <meshStandardMaterial color="#3f9b4b" />
            </mesh>
          )
        })}

        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.1, 6]} />
          <meshStandardMaterial color="#2f7a3a" />
        </mesh>

        <mesh position={[0, 0.3, 0.29]}>
          <boxGeometry args={[0.03, 0.12, 0.02]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>
    </Hotspot>
  )
}