import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DioramaContext } from './context'
import { Room } from './scene/Room'
import { Desk } from './scene/Desk'
import { Chair } from './scene/Chair'
import { Tomato } from './projects/Tomato'
import type { DioramaProps } from './types'
import { Character } from './scene/Character'
import { TravelMap } from './projects/TravelMap'
import { Webcam } from './projects/Webcam'
import { Village } from './projects/Village'

export function Diorama(props: DioramaProps) {
  return (
    <Canvas
      shadows
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [10, 8.5, 10], zoom: 50, near: 0.1, far: 100 }}
      onPointerMissed={() => props.onSelect(null)}
    >
      {/* Provider dentro do Canvas: todos os componentes 3D enxergam as props */}
      <DioramaContext.Provider value={props}>
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
        <Desk position={[0.4, 0, -3.95]} />
        <Chair position={[0.4, 0, -2.4]} />
        <Character position={[0.4, 0, -2.55]} />

        {/* em cima da mesa (y = 1.55), à direita do mouse */}
        <Tomato position={[1.85, 1.55, -3.4]} />
        <TravelMap />
        <Webcam />
        <Village />

        <axesHelper args={[3]} />
        <OrbitControls />
      </DioramaContext.Provider>
    </Canvas>
  )
}