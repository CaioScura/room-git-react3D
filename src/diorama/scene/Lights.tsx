import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDiorama } from '../context'
import { MOODS, LAMP_COLOR } from '../utils/moods'

export function Lights() {
  const { mood } = useDiorama()
  const moodLight = useRef<THREE.PointLight>(null!)
  const targetColor = useMemo(() => new THREE.Color(), []) // criada uma vez, reaproveitada

  useFrame((_, delta) => {
    const playing = mood !== null

    // 1) alvo: cor do mood ou a cor quente do abajur
    targetColor.set(playing ? MOODS[mood].color : LAMP_COLOR)

    // 2) transição suave da cor (mesma matemática do damp)
    const fraction = 1 - Math.exp(-delta * 3)
    moodLight.current.color.lerp(targetColor, fraction)

    // 3) com música, a luz fica mais forte
    moodLight.current.intensity = THREE.MathUtils.damp(moodLight.current.intensity, playing ? 14 : 5, 3, delta)
  })

  return (
    <>
      <ambientLight intensity={0.55} />
      {/* hemisphere: luz de "céu" (cima) e de "chão" (baixo), com cores diferentes */}
      <hemisphereLight args={['#fff4e0', '#6b5b95', 0.5]} />
      <directionalLight
        castShadow
        position={[6, 11, 6]}
        intensity={1.6}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* lâmpada no meio do quarto: muda de cor com o mood */}
      <pointLight ref={moodLight} position={[-2, 3.5, -1]} distance={12} decay={1.5} />
    </>
  )
}