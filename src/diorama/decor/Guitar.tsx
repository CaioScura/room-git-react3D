import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

const BODY = '#5a4fcf'
const NECK = '#3a2f3f'

// violão encostado na parede; montado de frente para +Z, com a base em y = 0
export function Guitar(props: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group {...props}>
      {/* inclinado para trás (−Z local), como quem encosta na parede */}
      <group rotation={[-0.2, 0, 0]}>
        {/* corpo: dois cilindros "deitados de frente" (bojo de baixo maior) formam o 8 */}
        {[
          { y: 0.4, r: 0.27 },
          { y: 0.72, r: 0.21 },
        ].map(({ y, r }) => (
          <mesh key={y} castShadow position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[r, r, 0.1, 28]} />
            <meshStandardMaterial color={BODY} roughness={0.35} />
          </mesh>
        ))}

        {/* boca (furo) + escudo claro + cavalete */}
        <mesh position={[0, 0.6, 0.051]}>
          <circleGeometry args={[0.07, 20]} />
          <meshBasicMaterial color="#14142a" />
        </mesh>
        <mesh position={[0.07, 0.5, 0.0505]} rotation={[0, 0, 0.4]} scale={[1, 1.6, 1]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color={PALETTE.lavender} />
        </mesh>
        <Box size={[0.16, 0.035, 0.02]} position={[0, 0.32, 0.06]} color={NECK} />

        {/* braço + mão (headstock) + tarraxas */}
        <Box size={[0.07, 0.78, 0.04]} position={[0, 1.27, 0.02]} color={NECK} radius={0.012} />
        <Box size={[0.1, 0.19, 0.035]} position={[0, 1.74, 0.01]} rotation={[-0.15, 0, 0]} color="#22223a" radius={0.012} />
        {[-1, 1].map((side) =>
          [0, 1, 2].map((i) => (
            <mesh key={`${side}${i}`} position={[side * 0.065, 1.68 + i * 0.055, 0.01]}>
              <sphereGeometry args={[0.013, 8, 6]} />
              <meshStandardMaterial color="#d9d7f7" metalness={0.6} roughness={0.3} />
            </mesh>
          )),
        )}

        {/* 6 cordas: caixinhas finíssimas do cavalete até a mão */}
        {[-0.025, -0.015, -0.005, 0.005, 0.015, 0.025].map((x) => (
          <mesh key={x} position={[x, 0.98, 0.062]}>
            <boxGeometry args={[0.002, 1.32, 0.002]} />
            <meshBasicMaterial color="#e9e6ff" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
