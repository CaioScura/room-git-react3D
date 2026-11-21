import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { useDiorama } from '../context'
import { getPomodoro } from '../utils/pomodoro'

const SKIN = '#f1c69a'
const HOODIE = '#5b4b8a'
const PANTS = '#2f3542'
const HAIR = '#3b2a20'

const { damp } = THREE.MathUtils

// personagem sentado, de costas para a câmera, olhando para a mesa (−Z)
export function Character(props: { position: [number, number, number] }) {
  const { hovered } = useDiorama()
  const leftArm = useRef<THREE.Group>(null!)
  const rightArm = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const { isBreak } = getPomodoro(t)

    // 1) decide o ALVO de cada articulação conforme o momento
    // digitando: braços para a frente, mexendo rápido e alternados (defasagem 1.8)
    let leftX = 1.35 + Math.sin(t * 20) * 0.07
    let rightX = 1.35 + Math.sin(t * 20 + 1.8) * 0.07
    let leftZ = 0
    let rightZ = 0
    let headX = -0.08 + Math.sin(t * 2) * 0.03 // olhando levemente para baixo, para a tela

    if (isBreak) {
      // pausa do pomodoro: braços para cima e abertos, cabeça para trás
      leftX = rightX = 2.95
      leftZ = -0.25
      rightZ = 0.25
      headX = 0.3
    }

    // hover na webcam (Expression Lab, etapa 3): acena com o braço direito
    const waving = hovered === 'expression'
    if (waving) {
      rightX = 2.6
      rightZ = 0.5 + Math.sin(t * 12) * 0.45 // balança de um lado para o outro
    }

    // 2) anda suavemente até o alvo (igual ao hover do Hotspot)
    const speed = 9
    leftArm.current.rotation.x = damp(leftArm.current.rotation.x, leftX, speed, delta)
    rightArm.current.rotation.x = damp(rightArm.current.rotation.x, rightX, speed, delta)
    leftArm.current.rotation.z = damp(leftArm.current.rotation.z, leftZ, speed, delta)
    rightArm.current.rotation.z = damp(rightArm.current.rotation.z, rightZ, speed, delta)
    head.current.rotation.x = damp(head.current.rotation.x, headX, speed, delta)
    head.current.rotation.y = damp(head.current.rotation.y, waving ? -0.5 : 0, speed, delta) // olha para a câmera ao acenar
  })

  return (
    <group position={props.position}>
      {/* pernas: coxa deitada para a frente, canela descendo até o chão */}
      {[-0.17, 0.17].map((x) => (
        <group key={x}>
          <Box size={[0.26, 0.24, 0.7]} position={[x, 1.1, -0.3]} color={PANTS} />
          <Box size={[0.24, 0.95, 0.24]} position={[x, 0.55, -0.62]} color={PANTS} />
          <Box size={[0.26, 0.12, 0.36]} position={[x, 0.06, -0.7]} color="#eeeeee" />
        </group>
      ))}

      {/* tronco e gola do moletom */}
      <Box size={[0.72, 0.82, 0.42]} position={[0, 1.62, 0]} color={HOODIE} />
      <Box size={[0.5, 0.18, 0.12]} position={[0, 1.95, 0.24]} color="#4a3d73" />

      {/* cabeça: o grupo fica no pescoço (pivô), para girar como uma cabeça de verdade */}
      <group ref={head} position={[0, 2.08, 0]}>
        <Box size={[0.48, 0.5, 0.46]} position={[0, 0.25, 0]} color={SKIN} />
        <Box size={[0.52, 0.2, 0.5]} position={[0, 0.48, 0.02]} color={HAIR} />
        <Box size={[0.52, 0.32, 0.12]} position={[0, 0.32, 0.22]} color={HAIR} />
        {/* fone de ouvido (aceno ao Mood Player) */}
        <Box size={[0.6, 0.05, 0.08]} position={[0, 0.6, 0]} color="#222" />
        <Box size={[0.08, 0.2, 0.18]} position={[-0.28, 0.28, 0]} color="#222" />
        <Box size={[0.08, 0.2, 0.18]} position={[0.28, 0.28, 0]} color="#222" />
      </group>

      {/* braços: cada grupo é o OMBRO (pivô); o braço fica pendurado para baixo */}
      <group ref={leftArm} position={[-0.46, 1.95, 0]}>
        <Box size={[0.2, 0.75, 0.22]} position={[0, -0.38, 0]} color={HOODIE} />
        <Box size={[0.16, 0.14, 0.18]} position={[0, -0.8, 0]} color={SKIN} />
      </group>
      <group ref={rightArm} position={[0.46, 1.95, 0]}>
        <Box size={[0.2, 0.75, 0.22]} position={[0, -0.38, 0]} color={HOODIE} />
        <Box size={[0.16, 0.14, 0.18]} position={[0, -0.8, 0]} color={SKIN} />
      </group>
    </group>
  )
}