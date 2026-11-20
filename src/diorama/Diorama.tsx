import { Canvas } from '@react-three/fiber'
// import { Room } from './scene/Room'
import type { DioramaProps } from './types'

function Room() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 8]} />
        <meshStandardMaterial color="#c9a989" />
      </mesh>
      <mesh position={[0, 2, -4]} receiveShadow>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color="#f1e5d7" />
      </mesh>
      <mesh position={[-4, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 8]} />
        <meshStandardMaterial color="#e7d4c1" />
      </mesh>
    </group>
  )
}

export function Diorama({ onSelect }: DioramaProps) {
  return (
    <Canvas
      shadows
      orthographic // câmera sem perspectiva = visual isométrico de diorama
      dpr={[1, 1.5]}
      camera={{ position: [10, 8.5, 10], zoom: 50, near: 0.1, far: 100 }}
      onPointerMissed={() => onSelect(null)} // clicar no vazio "desseleciona"
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[6, 11, 6]}
        intensity={1.6}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Room />
    </Canvas>
  )
}