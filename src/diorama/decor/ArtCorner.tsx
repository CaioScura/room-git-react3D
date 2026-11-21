import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { PALETTE } from '../utils/palette'

// pintura "em andamento" no cavalete: paisagem noturna com pinceladas
function createPaintingTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 250
  const ctx = canvas.getContext('2d')!
  const sky = ctx.createLinearGradient(0, 0, 0, 250)
  sky.addColorStop(0, '#2b2d6e')
  sky.addColorStop(0.6, '#8b8cf5')
  sky.addColorStop(1, '#f0a6ca')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 200, 250)
  // lua grande
  ctx.fillStyle = '#fdf8ff'
  ctx.beginPath()
  ctx.arc(140, 60, 26, 0, Math.PI * 2)
  ctx.fill()
  // montanhas em camadas
  const layers: [string, number][] = [['#5a4fcf', 170], ['#3d3a8a', 195], ['#2a2550', 220]]
  for (const [color, base] of layers) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, 250)
    for (let x = 0; x <= 200; x += 20) ctx.lineTo(x, base - Math.abs(Math.sin(x * 0.03 + base)) * 40)
    ctx.lineTo(200, 250)
    ctx.fill()
  }
  // pinceladas soltas (parte "ainda não terminada")
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(20 + i * 12, 30 + i * 8)
    ctx.lineTo(50 + i * 12, 24 + i * 8)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// perna de cavalete: caixa fina, com origem no pé (para girar a partir do chão)
function Leg({ position, rotation, height }: { position: [number, number, number]; rotation: [number, number, number]; height: number }) {
  return (
    <group position={position} rotation={rotation}>
      <Box size={[0.05, height, 0.05]} position={[0, height / 2, 0]} color={PALETTE.wood} />
    </group>
  )
}

// canto artístico: cavalete com tela + banquinho com paleta + potes de tinta e pincéis
export function ArtCorner({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const painting = useMemo(createPaintingTexture, [])
  useEffect(() => () => painting.dispose(), [painting])

  return (
    <group position={position} rotation={rotation}>
      {/* cavalete: 2 pernas da frente se encontrando no topo + 1 perna de trás */}
      <Leg position={[-0.32, 0, 0.15]} rotation={[-0.08, 0, -0.16]} height={2.0} />
      <Leg position={[0.32, 0, 0.15]} rotation={[-0.08, 0, 0.16]} height={2.0} />
      <Leg position={[0, 0, -0.45]} rotation={[0.3, 0, 0]} height={1.9} />
      <Box size={[0.8, 0.04, 0.14]} position={[0, 0.72, 0.13]} color={PALETTE.woodDark} />

      {/* tela apoiada na régua, levemente inclinada para trás */}
      <group position={[0, 1.27, 0.1]} rotation={[-0.08, 0, 0]}>
        <Box size={[0.8, 1.0, 0.04]} color={PALETTE.cream} />
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[0.76, 0.96]} />
          <meshStandardMaterial map={painting} roughness={0.9} />
        </mesh>
      </group>

      {/* banquinho com a paleta de tintas em cima */}
      <group position={[0.75, 0, 0.55]}>
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 20]} />
          <meshStandardMaterial color={PALETTE.wood} />
        </mesh>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.12, 0.3, Math.sin(a) * 0.12]} rotation={[Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12]}>
              <cylinderGeometry args={[0.018, 0.018, 0.6, 6]} />
              <meshStandardMaterial color={PALETTE.woodDark} />
            </mesh>
          )
        })}
        <group position={[0, 0.635, 0]} rotation={[0, 0.6, 0]}>
          <mesh castShadow scale={[1, 1, 0.75]}>
            <cylinderGeometry args={[0.15, 0.15, 0.015, 20]} />
            <meshStandardMaterial color="#e8d8c0" />
          </mesh>
          {/* bolinhas de tinta em volta da borda */}
          {[PALETTE.accent, PALETTE.pink, PALETTE.ice, PALETTE.lilac, '#ffd98a'].map((color, i) => {
            const a = (i / 5) * Math.PI * 1.6 + 0.3
            return (
              <mesh key={i} position={[Math.cos(a) * 0.1, 0.012, Math.sin(a) * 0.075]} scale={[1, 0.4, 1]}>
                <sphereGeometry args={[0.025, 8, 6]} />
                <meshStandardMaterial color={color} roughness={0.3} />
              </mesh>
            )
          })}
        </group>
      </group>

      {/* potes de tinta e pincéis no chão */}
      <group position={[-0.65, 0, 0.6]}>
        {[PALETTE.accentDeep, PALETTE.pink, PALETTE.ice].map((color, i) => (
          <mesh key={i} castShadow position={[i * 0.14 - 0.14, 0.07, (i % 2) * 0.1]}>
            <cylinderGeometry args={[0.06, 0.06, 0.14, 14]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
        <mesh castShadow position={[0.05, 0.1, -0.15]}>
          <cylinderGeometry args={[0.07, 0.06, 0.2, 14]} />
          <meshStandardMaterial color={PALETTE.lavender} />
        </mesh>
        {[-0.03, 0, 0.03].map((x, i) => (
          <mesh key={x} position={[0.05 + x, 0.28, -0.15]} rotation={[0, 0, x * 3]}>
            <cylinderGeometry args={[0.007, 0.007, 0.28, 6]} />
            <meshStandardMaterial color={[PALETTE.woodDark, PALETTE.accent, PALETTE.pink][i]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
