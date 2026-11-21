import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { DioramaContext } from './context'
import { CameraRig } from './scene/CameraRig'
import { Lights } from './scene/Lights'
import { Effects } from './scene/Effects'
import { Room } from './scene/Room'
import { Desk } from './scene/Desk'
import { Chair } from './scene/Chair'
import { Character } from './scene/Character'
import { Decor } from './decor/Decor'
import { Tomato } from './projects/Tomato'
import { TravelMap } from './projects/TravelMap'
import { Webcam } from './projects/Webcam'
import { Village } from './projects/Village'
import { RecordPlayer } from './projects/RecordPlayer'
import { Cat } from './projects/Cat'
import { CoffeeMug } from './projects/CoffeeMug'
import { Airplane } from './projects/Airplane'
import type { DioramaProps } from './types'

export function Diorama(props: DioramaProps) {
  // estado interno: só o quarto se importa com a música
  const [mood, setMood] = useState<number | null>(null)

  return (
    <Canvas
      shadows
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [10, 8.5, 10], zoom: 20, near: 0.1, far: 100 }}
      onPointerMissed={() => props.onSelect(null)}
    >
      {/* contexto = props de fora + estado de dentro */}
      <DioramaContext.Provider value={{ ...props, mood, setMood }}>
        <CameraRig />
        <Lights />

        {/* estrutura */}
        <Room />
        <Desk position={[-0.2, 0, -2.8]} />
        <Chair position={[-0.2, 0, -1.4]} />
        <Character position={[-0.2, 0, -1.55]} />

        {/* decoração (não clicável) */}
        <Decor />

        {/* os 8 projetos */}
        <Tomato position={[1.0, 1.55, -2.55]} />
        <TravelMap />
        <Webcam />
        <Village />
        <RecordPlayer />
        <Cat />
        <CoffeeMug />
        <Airplane />

        <Effects />
      </DioramaContext.Provider>
    </Canvas>
  )
}
