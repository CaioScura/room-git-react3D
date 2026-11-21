import { Box } from '../components/Box'

type Note = { x: number; y: number; color: string; tilt: number; size?: number }

// post-its e "fotos" presos no mural (coordenadas no plano do mural)
const NOTES: Note[] = [
  { x: -0.42, y: 0.18, color: '#c9c6ff', tilt: 0.08 },
  { x: -0.15, y: 0.2, color: '#f0a6ca', tilt: -0.12 },
  { x: -0.4, y: -0.17, color: '#9fd3ff', tilt: -0.05 },
  { x: 0.45, y: -0.2, color: '#b39dfa', tilt: 0.1 },
]
const PHOTOS: Note[] = [
  { x: 0.18, y: 0.12, color: '#8b8cf5', tilt: 0.06, size: 0.26 },
  { x: -0.05, y: -0.18, color: '#6a6cf0', tilt: -0.08, size: 0.22 },
]

// mural de cortiça acima da mesa: o "quadro de tarefas" de todo dev
export function Corkboard({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Box size={[1.35, 0.9, 0.05]} color="#2a2340" radius={0.02} />
      <Box size={[1.25, 0.8, 0.02]} position={[0, 0, 0.025]} color="#c89f6e" />

      {NOTES.map((n, i) => (
        <group key={i} position={[n.x, n.y, 0.04]} rotation={[0, 0, n.tilt]}>
          <Box size={[0.22, 0.22, 0.005]} color={n.color} />
          {/* "linhas escritas" no post-it */}
          {[0.04, -0.01, -0.06].map((ly) => (
            <Box key={ly} size={[0.14, 0.012, 0.002]} position={[0, ly, 0.004]} color="#7a6a58" />
          ))}
          <mesh position={[0, 0.09, 0.01]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshStandardMaterial color="#e5483b" />
          </mesh>
        </group>
      ))}

      {PHOTOS.map((p, i) => (
        <group key={i} position={[p.x, p.y, 0.04]} rotation={[0, 0, p.tilt]}>
          {/* foto "polaroid": borda branca + imagem colorida */}
          <Box size={[p.size!, p.size! * 1.15, 0.005]} color="#fdfaf3" />
          <Box size={[p.size! * 0.85, p.size! * 0.8, 0.002]} position={[0, 0.02, 0.004]} color={p.color} />
          <mesh position={[0, p.size! * 0.5, 0.01]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshStandardMaterial color="#3b6e8f" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
