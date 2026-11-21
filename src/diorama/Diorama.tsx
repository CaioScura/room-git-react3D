import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DioramaContext } from './context'
import { Lights } from './scene/Lights'
import { Room } from './scene/Room'
import { Desk } from './scene/Desk'
import { Chair } from './scene/Chair'
import { Character } from './scene/Character'
import { Tomato } from './projects/Tomato'
import { TravelMap } from './projects/TravelMap'
import { Webcam } from './projects/Webcam'
import { Village } from './projects/Village'
import { RecordPlayer } from './projects/RecordPlayer'
import { Cat } from './projects/Cat'
import type { DioramaProps } from './types'

export function Diorama(props: DioramaProps) {
  // estado interno: só o quarto se importa com a música
  const [mood, setMood] = useState<number | null>(null)

  return (
    <Canvas
      shadows
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [10, 8.5, 10], zoom: 50, near: 0.1, far: 100 }}
      onPointerMissed={() => props.onSelect(null)}
    >
      {/* contexto = props de fora + estado de dentro */}
      <DioramaContext.Provider value={{ ...props, mood, setMood }}>
        <Lights />

        <Room />
        <Desk position={[0.4, 0, -3.95]} />
        <Chair position={[0.4, 0, -2.4]} />
        <Character position={[0.4, 0, -2.55]} />

        {/* os 6 projetos */}
        <Tomato position={[1.85, 1.55, -3.4]} />
        <TravelMap />
        <Webcam />
        <Village />
        <RecordPlayer />
        <Cat />

        <axesHelper args={[3]} />
        <OrbitControls />
      </DioramaContext.Provider>
    </Canvas>
  )
}