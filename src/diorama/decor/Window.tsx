import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'
import { Succulent } from './Plants'

const W = 1.3 // largura da janela
const H = 1.4 // altura
const CENTER_Y = 2.55
const CURTAIN = '#6a5fc4'

// céu de entardecer/noite desenhado num canvas: degradê roxo, lua, estrelas e prédios
function createSkyTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 280
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 280)
  gradient.addColorStop(0, '#1d1f4a') // azul-noite no alto
  gradient.addColorStop(0.55, '#5a4fb0') // roxo
  gradient.addColorStop(1, '#e69ac8') // rosa no horizonte
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 280)

  // estrelas: pontinhos em posições "aleatórias" fixas
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 40; i++) {
    const x = (i * 73) % 256
    const y = (i * 37) % 150
    ctx.globalAlpha = 0.4 + ((i * 13) % 6) / 10
    ctx.fillRect(x, y, 2, 2)
  }
  ctx.globalAlpha = 1

  // lua crescente: um círculo claro "mordido" por outro da cor do céu
  ctx.fillStyle = '#f4f1ff'
  ctx.beginPath()
  ctx.arc(185, 60, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#25285a'
  ctx.beginPath()
  ctx.arc(196, 52, 20, 0, Math.PI * 2)
  ctx.fill()

  // silhueta de prédios com janelinhas acesas
  ctx.fillStyle = '#2a2550'
  const buildings = [[0, 50, 55], [55, 35, 80], [95, 60, 45], [160, 40, 70], [205, 51, 50]]
  for (const [x, w, h] of buildings) ctx.fillRect(x, 280 - h, w, h)
  ctx.fillStyle = '#ffd98a'
  for (const [x, w, h] of buildings) {
    for (let wy = 280 - h + 8; wy < 272; wy += 14) {
      for (let wx = x + 6; wx < x + w - 6; wx += 12) {
        if ((wx * 7 + wy * 3) % 5 === 0) ctx.fillRect(wx, wy, 5, 6)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// cortina feita de cilindros lado a lado = "dobras" de tecido
function Curtain({ x }: { x: number }) {
  return (
    <group position={[x, 2.6, 0.12]}>
      {[-0.12, -0.04, 0.04, 0.12].map((dx, i) => (
        <mesh key={i} castShadow position={[dx, 0, (i % 2) * 0.03]}>
          <cylinderGeometry args={[0.055, 0.065, 1.7, 10]} />
          <meshStandardMaterial color={CURTAIN} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// janela na parede do fundo, à direita; origem do grupo = chão, encostado na parede
export function Window({ position }: { position: [number, number, number] }) {
  const sky = useMemo(createSkyTexture, [])
  useEffect(() => () => sky.dispose(), [sky])

  return (
    <group position={position}>
      <Box size={[W + 0.2, H + 0.2, 0.06]} position={[0, CENTER_Y, 0]} color={PALETTE.lavender} radius={0.02} />
      <mesh position={[0, CENTER_Y, 0.035]}>
        <planeGeometry args={[W, H]} />
        {/* Basic + toneMapped false: o céu "emite" luz, não depende das luzes do quarto */}
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      <Box size={[0.05, H, 0.05]} position={[0, CENTER_Y, 0.05]} color={PALETTE.lavender} />
      <Box size={[W, 0.05, 0.05]} position={[0, CENTER_Y, 0.05]} color={PALETTE.lavender} />

      {/* parapeito com plantinhas */}
      <Box size={[W + 0.4, 0.07, 0.3]} position={[0, CENTER_Y - H / 2 - 0.12, 0.12]} color={PALETTE.lavender} radius={0.02} />
      <Succulent position={[-0.45, CENTER_Y - H / 2 - 0.085, 0.13]} />
      <Succulent position={[0.42, CENTER_Y - H / 2 - 0.085, 0.13]} potColor={PALETTE.accentDeep} />

      {/* varão + cortinas abertas */}
      <mesh castShadow position={[0, CENTER_Y + H / 2 + 0.17, 0.14]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, W + 0.9, 8]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>
      <Curtain x={-(W / 2 + 0.2)} />
      <Curtain x={W / 2 + 0.2} />
    </group>
  )
}
