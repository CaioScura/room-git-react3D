import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

type Vec3 = [number, number, number]

// quadro abstrato: degradê + formas geométricas sobrepostas
function drawAbstract(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#2b2d6e')
  g.addColorStop(1, '#6a6cf0')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.globalAlpha = 0.85
  ctx.fillStyle = '#f0a6ca'
  ctx.beginPath()
  ctx.arc(w * 0.35, h * 0.35, w * 0.22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#9fd3ff'
  ctx.fillRect(w * 0.45, h * 0.5, w * 0.35, h * 0.3)
  ctx.fillStyle = '#ecebff'
  ctx.beginPath()
  ctx.moveTo(w * 0.15, h * 0.9)
  ctx.lineTo(w * 0.5, h * 0.55)
  ctx.lineTo(w * 0.6, h * 0.9)
  ctx.fill()
  ctx.globalAlpha = 1
}

// esboço a lápis num papel claro: rostinho em traço solto (estilo rascunho)
function drawSketch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#f7f5ff'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#2b2b44'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.ellipse(w / 2, h * 0.52, w * 0.26, h * 0.24, 0, 0, Math.PI * 2) // rosto
  ctx.stroke()
  ctx.beginPath() // cabelo em "pontas"
  ctx.moveTo(w * 0.22, h * 0.45)
  for (let i = 0; i <= 8; i++) ctx.lineTo(w * (0.22 + i * 0.07), h * (i % 2 ? 0.22 : 0.33))
  ctx.stroke()
  ctx.fillStyle = '#2b2b44' // olhos
  ctx.beginPath()
  ctx.arc(w * 0.41, h * 0.53, 5, 0, Math.PI * 2)
  ctx.arc(w * 0.59, h * 0.53, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath() // boquinha
  ctx.arc(w / 2, h * 0.66, 8, Math.PI * 1.15, Math.PI * 1.85)
  ctx.stroke()
  ctx.fillStyle = 'rgba(240,166,202,0.6)' // bochechas coradas
  ctx.beginPath()
  ctx.arc(w * 0.34, h * 0.6, 9, 0, Math.PI * 2)
  ctx.arc(w * 0.66, h * 0.6, 9, 0, Math.PI * 2)
  ctx.fill()
}

// quadro genérico: moldura + "papel/tela" com uma textura desenhada pela função recebida
function Frame({
  position,
  rotation,
  size,
  frameColor,
  draw,
}: {
  position: Vec3
  rotation?: Vec3
  size: [number, number]
  frameColor: string
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}) {
  const [w, h] = size
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = Math.round((160 * h) / w) // mesma proporção do quadro
    draw(canvas.getContext('2d')!, canvas.width, canvas.height)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [w, h, draw])
  useEffect(() => () => texture.dispose(), [texture])

  return (
    <group position={position} rotation={rotation}>
      <Box size={[w + 0.08, h + 0.08, 0.04]} color={frameColor} radius={0.012} />
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
    </group>
  )
}

// quadros da parede da esquerda (todos girados 90° para olhar para dentro do quarto)
export function WallArt() {
  const facingRoom: Vec3 = [0, Math.PI / 2, 0]
  return (
    <group>
      <Frame position={[-3.47, 2.65, 2.15]} rotation={facingRoom} size={[0.62, 0.82]} frameColor={PALETTE.navy} draw={drawAbstract} />
      <Frame position={[-3.47, 2.95, -0.3]} rotation={facingRoom} size={[0.42, 0.52]} frameColor={PALETTE.lavender} draw={drawSketch} />
    </group>
  )
}
