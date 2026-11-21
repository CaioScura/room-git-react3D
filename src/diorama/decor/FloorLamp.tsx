import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDiorama } from '../context'
import { MOODS, LAMP_COLOR } from '../utils/moods'

const POLE_HEIGHT = 2.3

// luminária de chão: a LUZ DO MOOD mora aqui (antes ficava solta no Lights.tsx)
export function FloorLamp({ position }: { position: [number, number, number] }) {
  const { mood } = useDiorama()
  const light = useRef<THREE.PointLight>(null!)
  const shade = useRef<THREE.MeshStandardMaterial>(null!)
  const bulb = useRef<THREE.MeshBasicMaterial>(null!)
  const targetColor = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    const playing = mood !== null
    targetColor.set(playing ? MOODS[mood].color : LAMP_COLOR)
    const fraction = 1 - Math.exp(-delta * 3)

    // luz, cúpula e lâmpada mudam de cor juntas
    light.current.color.lerp(targetColor, fraction)
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, playing ? 14 : 7, 3, delta)
    shade.current.emissive.lerp(targetColor, fraction)
    // lâmpada com cor > 1 = bloom
    bulb.current.color.copy(light.current.color).multiplyScalar(3)
  })

  return (
    <group position={position}>
      {/* base + haste */}
      <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.06, 24]} />
        <meshStandardMaterial color="#2a2340" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, POLE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, POLE_HEIGHT, 8]} />
        <meshStandardMaterial color="#b8b6e8" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* cúpula: cilindro aberto (sem tampa), visível dos dois lados */}
      <mesh position={[0, POLE_HEIGHT + 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.34, 0.4, 24, 1, true]} />
        <meshStandardMaterial
          ref={shade}
          color="#e9e6ff"
          emissive={LAMP_COLOR}
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          roughness={1}
        />
      </mesh>
      <mesh position={[0, POLE_HEIGHT - 0.05, 0]}>
        <sphereGeometry args={[0.09, 14, 10]} />
        <meshBasicMaterial ref={bulb} toneMapped={false} />
      </mesh>

      {/* a luz de verdade, logo abaixo da cúpula */}
      <pointLight ref={light} position={[0, POLE_HEIGHT - 0.2, 0.3]} distance={9} decay={1.4} color={LAMP_COLOR} />
    </group>
  )
}
