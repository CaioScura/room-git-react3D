import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { playTone } from '../utils/sounds'

const FUR = '#f4a259'
const DARK = '#c9772f'
const AWAKE_MS = 3000

// gato dormindo numa almofada no canto esquerdo da mesa
export function Cat() {
  const [awake, setAwake] = useState(false) // estado local: só o gato precisa saber
  const body = useRef<THREE.Group>(null!)
  const timer = useRef<number | undefined>(undefined) // React 19: useRef exige valor inicial

  // se o componente sair da tela com o timer rodando, cancela
  useEffect(() => () => clearTimeout(timer.current), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const { damp } = THREE.MathUtils

    // acordado: sobe e flutua; dormindo: desce para a almofada
    const targetY = awake ? 0.45 + Math.sin(t * 4) * 0.06 : 0
    body.current.position.y = damp(body.current.position.y, targetY, 6, delta)

    // dormindo: "respira" (estica um pouco na altura); acordado: balança de leve
    body.current.scale.y = awake ? 1 : 1 + Math.sin(t * 2) * 0.04
    body.current.rotation.z = awake ? Math.sin(t * 3) * 0.12 : 0
  })

  function wakeUp() {
    setAwake(true)
    playTone([720, 880, 520], 0.45, 'sawtooth') // "miau" eletrônico: sobe e desce
    clearTimeout(timer.current) // cancela o timer anterior, se houver
    timer.current = window.setTimeout(() => setAwake(false), AWAKE_MS)
  }

  return (
    <Hotspot id="gatos" label="Gatos Flutuantes" position={[-1.05, 1.55, -4.15]} labelOffset={[0, 1.1, 0]} onActivate={wakeUp}>
      {/* almofada */}
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.38, 0.4, 0.08, 20]} />
        <meshStandardMaterial color="#b9a7e8" />
      </mesh>

      {/* corpo inteiro num grupo, para flutuar e balançar junto */}
      <group ref={body}>
        <Box size={[0.5, 0.24, 0.34]} position={[0, 0.2, 0]} color={FUR} />
        <Box size={[0.12, 0.25, 0.34]} position={[-0.05, 0.2, 0]} color={DARK} /> {/* listra */}

        {/* cabeça: um pouco mais alta quando acordado (levantou a cabeça) */}
        <group position={[0.3, awake ? 0.36 : 0.22, 0.02]}>
          <Box size={[0.26, 0.24, 0.26]} color={FUR} />
          <Box size={[0.07, 0.09, 0.05]} position={[-0.07, 0.15, -0.06]} color={DARK} /> {/* orelhas */}
          <Box size={[0.07, 0.09, 0.05]} position={[-0.07, 0.15, 0.08]} color={DARK} />
          {/* olhos: tracinho fechado dormindo, aberto acordado */}
          <Box size={[0.02, awake ? 0.05 : 0.015, 0.04]} position={[0.13, 0.03, -0.06]} color="#222" />
          <Box size={[0.02, awake ? 0.05 : 0.015, 0.04]} position={[0.13, 0.03, 0.06]} color="#222" />
        </group>

        {/* rabo enrolado para o lado */}
        <Box size={[0.1, 0.08, 0.36]} position={[-0.28, 0.13, 0.1]} rotation={[0, 0.5, 0]} color={DARK} />
      </group>

      {awake && (
        <Html position={[0.4, 1.0, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={bubbleStyle}>miau!</div>
        </Html>
      )}
    </Hotspot>
  )
}

const bubbleStyle: React.CSSProperties = {
  font: '700 13px sans-serif',
  background: '#fff',
  color: '#13111c',
  padding: '4px 10px',
  borderRadius: '12px 12px 12px 2px', // canto "cortado" = balão de fala
  whiteSpace: 'nowrap',
}