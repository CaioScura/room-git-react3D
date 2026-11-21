import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { useDiorama } from '../context'

// pontos da rota no "plano do quadro": x = lados, y = altura (z é para fora do quadro)
const ROUTE: [number, number][] = [
  [-0.7, -0.2],
  [-0.15, 0.3],
  [0.35, -0.1],
  [0.75, 0.35],
]
const PIN_Z = 0.05 // um pouco à frente do mapa, para não ter z-fighting

// desenha o mapa (mar + continentes) num canvas, uma vez só
function createMapTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 440
  canvas.height = 280 // proporção ≈ 1.57, igual ao plano 2.15 × 1.35 + ~1.6
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#9cd1e6'
  ctx.fillRect(0, 0, 440, 280)
  ctx.fillStyle = '#b9d98f'
  const lands: [number, number, number, number][] = [
    [90, 120, 80, 60], [230, 90, 70, 50], [330, 170, 80, 55], [160, 210, 60, 35],
  ]
  for (const [x, y, rx, ry] of lands) {
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0.4, 0, Math.PI * 2) // elipse inclinada = "continente"
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

  const texture = useMemo(() => createMapTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    pins.current.forEach((pin, i) => {
      // no hover: pulinhos em sequência (cada alfinete atrasado 0.9 em relação ao anterior)
      const jump = isHovered ? Math.max(0, Math.sin(t * 6 - i * 0.9)) * 0.12 : 0
      const target = ROUTE[i][1] + jump
      pin.position.y = THREE.MathUtils.damp(pin.position.y, target, 15, delta)
    })
  })

  return (
    // girado 90° em Y: o quadro passa a olhar para +X (para dentro do quarto)
    <Hotspot
      id="travel"
      label="AI Travel Planner"
      position={[-4.97, 2.75, -1.3]}
      rotation={[0, Math.PI / 2, 0]}
      labelOffset={[0, 1.05, 0.2]}
    >
      {/* moldura + mapa */}
      <Box size={[2.3, 1.5, 0.06]} color="#5a3b25" />
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.15, 1.35]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* rota tracejada ligando os pontos */}
      <Line
        points={ROUTE.map(([x, y]) => [x, y, PIN_Z] as [number, number, number])}
        color="#e5483b"
        lineWidth={2}
        dashed
        dashSize={0.06}
        gapSize={0.04}
      />

      {/* alfinetes: cada grupo guardado no array de refs */}
      {ROUTE.map(([x, y], i) => (
        <group key={i} ref={(el) => { if (el) pins.current[i] = el }} position={[x, y, PIN_Z]}>
          <mesh castShadow position={[0, 0.08, 0.04]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            {/* o último ponto (destino) é laranja */}
            <meshStandardMaterial color={i === ROUTE.length - 1 ? '#f59e0b' : '#e5483b'} />
          </mesh>
        </group>
      ))}
    </Hotspot>
  )
}