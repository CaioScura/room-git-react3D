import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// letreiro neon "</>": cada traço é uma linha reta; juntamos as retas num caminho e
// passamos um "tubo" (TubeGeometry) por ele, como um tubo de neon de verdade
const STROKES: [number, number][][] = [
  [[-0.3, 0.15], [-0.42, 0], [-0.3, -0.15]], // <
  [[-0.07, -0.17], [0.07, 0.17]], // /
  [[0.3, 0.15], [0.42, 0], [0.3, -0.15]], // >
]

function buildTubes() {
  return STROKES.map((points) => {
    const path = new THREE.CurvePath<THREE.Vector3>()
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[i + 1]
      path.add(new THREE.LineCurve3(new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)))
    }
    return new THREE.TubeGeometry(path, 32, 0.018, 8, false)
  })
}

export function NeonSign({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const tubes = useMemo(buildTubes, [])
  // um material só, compartilhado pelos 3 tubos (todos brilham juntos)
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), [])
  useEffect(() => () => {
    tubes.forEach((t) => t.dispose())
    material.dispose()
  }, [tubes, material])

  // neon "respirando" e, de vez em quando, uma piscadinha
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const blink = Math.sin(t * 0.7) > 0.985 ? 0.4 : 1
    const glow = (2.6 + Math.sin(t * 2) * 0.25) * blink
    material.color.setRGB(0.55 * glow, 0.55 * glow, 0.96 * glow)
  })

  return (
    <group position={position} rotation={rotation}>
      {/* placa de acrílico escura atrás */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.0, 0.5, 0.015]} />
        <meshStandardMaterial color="#1c1d33" transparent opacity={0.7} roughness={0.2} />
      </mesh>
      {tubes.map((geometry, i) => (
        <mesh key={i} geometry={geometry} material={material} />
      ))}
    </group>
  )
}
