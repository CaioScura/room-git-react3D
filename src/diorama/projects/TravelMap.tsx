import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { useDiorama } from '../context'
import { PALETTE } from '../utils/palette'

// pontos da rota no "plano do quadro": x = lados, y = altura (z é para fora do quadro)
const ROUTE: [number, number][] = [
  [-0.7, -0.2],
  [-0.15, 0.3],
  [0.35, -0.1],
  [0.75, 0.35],
]
const PIN_Z = 0.05

function createMapTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 440
  canvas.height = 280
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#8fb3ea'
  ctx.fillRect(0, 0, 440, 280)
  ctx.fillStyle = '#b5dcb4'
  const lands: [number, number, number, number][] = [
    [90, 120, 80, 60], [230, 90, 70, 50], [330, 170, 80, 55], [160, 210, 60, 35],
  ]
  for (const [x, y, rx, ry] of lands) {
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function TravelMap() {
  const { hovered } = useDiorama()
  const isHovered = hovered === 'travel'
  const pins = useRef<THREE.Group[]>([])

  const texture = useMemo(createMapTexture, [])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    pins.current.forEach((pin, i) => {
      const jump = isHovered ? Math.max(0, Math.sin(t * 6 - i * 0.9)) * 0.12 : 0
      pin.position.y = THREE.MathUtils.damp(pin.position.y, ROUTE[i][1] + jump, 15, delta)
    })
  })

  return (
    // grupo externo: posição na parede, giro de 90° e escala 0.65 (quarto compacto)
    <group position={[-3.47, 2.55, 0.85]} rotation={[0, Math.PI / 2, 0]} scale={0.65}>
    <Hotspot id="travel" label="AI Travel Planner" labelOffset={[0, 1.15, 0.2]}>
      <Box size={[2.3, 1.5, 0.06]} color={PALETTE.navy} radius={0.02} />
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.15, 1.35]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Line
        points={ROUTE.map(([x, y]) => [x, y, PIN_Z] as [number, number, number])}
        color={PALETTE.pink}
        lineWidth={2}
        dashed
        dashSize={0.06}
        gapSize={0.04}
      />
      {ROUTE.map(([x, y], i) => (
        <group key={i} ref={(el) => { if (el) pins.current[i] = el }} position={[x, y, PIN_Z]}>
          <mesh castShadow position={[0, 0.08, 0.04]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <meshStandardMaterial color={i === ROUTE.length - 1 ? PALETTE.accentDeep : '#e5483b'} />
          </mesh>
        </group>
      ))}
    </Hotspot>
    </group>
  )
}
