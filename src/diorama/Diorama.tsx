import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Room } from '../scene/Room'
import { Desk } from '../scene/Desk'
import { Chair } from '../scene/Chair'
import type { DioramaProps } from './types'

export function Diorama({ onSelect }: DioramaProps) {
  return (
    <Canvas
      shadows
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [10, 8.5, 10], zoom: 50, near: 0.1, far: 100 }}
      onPointerMissed={() => onSelect(null)}
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
      {/* mesa encostada na parede do fundo; cadeira na frente dela */}
      <Desk position={[0.4, 0, -3.95]} />
      <Chair position={[0.4, 0, -2.4]} />

      {/* ferramentas de desenvolvimento: tirar depois */}
      <axesHelper args={[3]} />
      <OrbitControls />
    </Canvas>
  )
}