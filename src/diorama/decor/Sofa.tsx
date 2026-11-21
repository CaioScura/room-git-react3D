import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

const SOFA = '#4b4f9e'
const CUSHION = '#5b5fc7'

// tela do console: um "joguinho" de plataforma em pixel art, desenhado no canvas
function createGameTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 72
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#2b2d6e'
  ctx.fillRect(0, 0, 128, 72)
  ctx.fillStyle = '#f4f1ff' // lua
  ctx.fillRect(98, 8, 10, 10)
  ctx.fillStyle = '#8b8cf5' // plataformas
  ctx.fillRect(0, 60, 128, 12)
  ctx.fillRect(20, 44, 30, 6)
  ctx.fillRect(70, 34, 26, 6)
  ctx.fillStyle = '#f0a6ca' // personagenzinho
  ctx.fillRect(30, 34, 8, 10)
  ctx.fillStyle = '#ffd98a' // moedas
  ctx.fillRect(76, 26, 4, 4)
  ctx.fillRect(86, 26, 4, 4)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.magFilter = THREE.NearestFilter // pixels "duros", sem borrar (visual de pixel art)
  return texture
}

// console portátil genérico (inspirado nos híbridos tipo Switch, sem marca), deitado no assento
function HandheldConsole(props: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const screen = useMemo(createGameTexture, [])
  useEffect(() => () => screen.dispose(), [screen])

  return (
    <group {...props}>
      <Box size={[0.3, 0.025, 0.14]} color="#22223a" radius={0.008} />
      {/* tela: plano deitado (girado −90° em X) olhando para cima */}
      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.24, 0.12]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      {/* controles laterais em azul e rosa (as cores do quarto) + analógicos */}
      {[
        { x: -0.18, color: PALETTE.accentDeep },
        { x: 0.18, color: PALETTE.pink },
      ].map(({ x, color }) => (
        <group key={x} position={[x, 0, 0]}>
          <Box size={[0.06, 0.028, 0.14]} color={color} radius={0.01} />
          <mesh position={[0, 0.02, x < 0 ? -0.03 : 0.03]}>
            <cylinderGeometry args={[0.012, 0.012, 0.015, 10]} />
            <meshStandardMaterial color="#1c1d33" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// sofá de 2 lugares; montado "de frente" para +Z (girar para encostar na parede)
export function Sofa(props: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group {...props}>
      {/* pés */}
      {[[-0.9, -0.35], [0.9, -0.35], [-0.9, 0.35], [0.9, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]}>
          <cylinderGeometry args={[0.035, 0.025, 0.14, 8]} />
          <meshStandardMaterial color={PALETTE.woodDark} />
        </mesh>
      ))}

      {/* base, encosto e braços */}
      <Box size={[2.0, 0.3, 0.9]} position={[0, 0.3, 0]} color={SOFA} radius={0.06} />
      <Box size={[2.0, 0.62, 0.22]} position={[0, 0.74, -0.34]} color={SOFA} radius={0.09} />
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.2, 0.48, 0.9]} position={[side * 0.98, 0.56, 0]} color={SOFA} radius={0.08} />
      ))}

      {/* 2 almofadas do assento */}
      {[-0.44, 0.44].map((x) => (
        <Box key={x} size={[0.86, 0.17, 0.7]} position={[x, 0.53, 0.07]} color={CUSHION} radius={0.07} />
      ))}

      {/* almofadas de enfeite encostadas, levemente tortas */}
      <Box size={[0.4, 0.38, 0.12]} position={[-0.6, 0.83, -0.16]} rotation={[-0.25, 0.1, 0.12]} color={PALETTE.pink} radius={0.06} />
      <Box size={[0.36, 0.34, 0.12]} position={[0.62, 0.81, -0.16]} rotation={[-0.25, -0.15, -0.1]} color={PALETTE.lilac} radius={0.06} />

      {/* manta caindo pelo braço direito */}
      <group position={[0.98, 0.8, 0.05]}>
        <Box size={[0.26, 0.05, 0.6]} color={PALETTE.lavender} radius={0.02} />
        <Box size={[0.05, 0.45, 0.6]} position={[0.13, -0.22, 0]} color={PALETTE.lavender} radius={0.02} />
      </group>

      <HandheldConsole position={[0.1, 0.635, 0.15]} rotation={[0, 0.35, 0]} />
    </group>
  )
}
