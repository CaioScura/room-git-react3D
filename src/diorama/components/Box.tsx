import { RoundedBox } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

type BoxProps = Omit<ThreeElements['mesh'], 'args' | 'ref'> & {
  size: [number, number, number]
  color: string
  radius?: number // > 0 = cantos arredondados (bem mais "cozy")
  roughness?: number
}

// caixa com sombra: usada em quase tudo (paredes, móveis...)
export function Box({ size, color, radius = 0, roughness = 0.85, ...props }: BoxProps) {
  // RoundedBox do drei: mesma caixa, com as quinas arredondadas
  if (radius > 0) {
    return (
      <RoundedBox args={size} radius={radius} smoothness={3} castShadow receiveShadow {...props}>
        <meshStandardMaterial color={color} roughness={roughness} />
      </RoundedBox>
    )
  }

  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  )
}
