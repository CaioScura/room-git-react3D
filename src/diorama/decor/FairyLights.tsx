import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

type Vec3 = [number, number, number]

// cores das lampadinhas em RGB; multiplicadas por >1 no useFrame para o bloom "pegar"
const BULB_COLORS: Vec3[] = [
  [0.6, 0.6, 1], // roxo-azulado (o do portfólio)
  [0.85, 0.75, 1], // lilás
  [1, 0.7, 0.9], // rosado
  [0.7, 0.9, 1], // azul-gelo
]

const SAMPLES_PER_SPAN = 24 // pontos calculados em cada "barriga" do fio
const BULB_EVERY = 4 // uma lâmpada a cada 4 pontos

// calcula o fio: entre cada par de ganchos, o fio "cai" formando uma barriga (parábola)
function buildWire(hooks: Vec3[], sag: number) {
  const points: THREE.Vector3[] = []
  for (let h = 0; h < hooks.length - 1; h++) {
    const a = new THREE.Vector3(...hooks[h])
    const b = new THREE.Vector3(...hooks[h + 1])
    for (let i = 0; i < SAMPLES_PER_SPAN; i++) {
      const u = i / SAMPLES_PER_SPAN // 0 → 1 ao longo do trecho
      const p = a.clone().lerp(b, u) // reta entre os ganchos...
      p.y -= sag * 4 * u * (1 - u) // ...menos a barriga: 0 nas pontas, máximo no meio
      points.push(p)
    }
  }
  points.push(new THREE.Vector3(...hooks[hooks.length - 1]))
  return points
}

// pisca-pisca: fio + lampadinhas que brilham (bloom) e piscam devagar
export function FairyLights({ hooks, sag = 0.3 }: { hooks: Vec3[]; sag?: number }) {
  const wire = useMemo(() => buildWire(hooks, sag), [hooks, sag])
  const bulbs = useMemo(() => wire.filter((_, i) => i % BULB_EVERY === 2), [wire])

  // um material por lâmpada: cada uma pisca no seu próprio ritmo
  const materials = useMemo(
    () => bulbs.map(() => new THREE.MeshBasicMaterial({ toneMapped: false })),
    [bulbs],
  )
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    materials.forEach((material, i) => {
      const [r, g, b] = BULB_COLORS[i % BULB_COLORS.length]
      // brilho entre ~1.6 e ~2.8: sempre acima de 1, então sempre com bloom
      const glow = 2.2 + Math.sin(t * 1.5 + i * 1.7) * 0.6
      material.color.setRGB(r * glow, g * glow, b * glow)
    })
  })

  return (
    <group>
      <Line points={wire} color="#1c1d33" lineWidth={1.2} />
      {bulbs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y - 0.04, p.z]} material={materials[i]}>
          <sphereGeometry args={[0.035, 10, 8]} />
        </mesh>
      ))}
    </group>
  )
}
