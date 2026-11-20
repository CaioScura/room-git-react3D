import type { ThreeElements } from '@react-three/fiber'

type BoxProps = ThreeElements['mesh'] & {
  size: [number, number, number]
  color: string
}

// caixa com sombra: vamos usar em quase tudo (paredes, móveis...)
export function Box({ size, color, ...props }: BoxProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}