import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { useDiorama } from '../context'
import { MOODS } from '../utils/moods'
import { playTone } from '../utils/sounds'

const NOTES = 3

// mesinha + toca-discos, perto da parede da esquerda
export function RecordPlayer() {
  const { mood, setMood } = useDiorama()
  const disc = useRef<THREE.Group>(null!)
  const notes = useRef<THREE.Group>(null!)
  const playing = mood !== null
  const color = playing ? MOODS[mood].color : '#e5483b'

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // disco gira só com a música tocando
    if (playing) disc.current.rotation.y += delta * 3

    // notas: cada uma num ponto diferente do ciclo de subir e sumir
    notes.current.visible = playing
    notes.current.children.forEach((note, i) => {
      const c = (t * 0.6 + i / NOTES) % 1 // 0 → 1, recomeça
      note.position.set(Math.sin(c * 6 + i) * 0.15, 0.3 + c * 0.9, 0) // sobe balançando
      note.scale.setScalar(Math.sin(c * Math.PI)) // nasce pequena, cresce, some
    })
  })

  // cada clique: null → Calmo → Foco → Energia → Calmo...
  function nextMood() {
    setMood((current) => (current === null ? 0 : (current + 1) % MOODS.length))
    playTone([392, 494, 587], 0.6, 'triangle') // sol, si, ré: um acorde de Sol maior
  }

  return (
    <group position={[-3.7, 0, 0.9]}>
      {/* mesinha: tampo + 4 pernas */}
      <Box size={[1.2, 0.08, 1.0]} position={[0, 1.0, 0]} color="#8b5e3c" />
      {[[-0.5, -0.4], [0.5, -0.4], [-0.5, 0.4], [0.5, 0.4]].map(([x, z], i) => (
        <Box key={i} size={[0.07, 1.0, 0.07]} position={[x, 0.5, z]} color="#5a3b25" />
      ))}

      {/* o toca-discos é o hotspot (a mesinha não é clicável) */}
      <Hotspot id="mood" label="Mood Player" position={[0, 1.04, 0]} labelOffset={[0, 1.4, 0]} onActivate={nextMood}>
        <Box size={[0.95, 0.14, 0.75]} position={[0, 0.07, 0]} color="#3b2a20" />

        {/* disco: grupo que gira; o rótulo central mostra a cor do mood */}
        <group ref={disc} position={[-0.08, 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
            <meshStandardMaterial color="#111" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* marquinha branca: sem ela, não daria para ver o disco girando */}
          <Box size={[0.04, 0.012, 0.04]} position={[0.06, 0.02, 0]} color="#fff" />
        </group>

        {/* braço da agulha */}
        <Box size={[0.04, 0.04, 0.45]} position={[0.33, 0.2, -0.05]} rotation={[0, 0.35, 0]} color="#cccccc" />

        {/* notas musicais (octaedro = "losango" 3D) */}
        <group ref={notes}>
          {Array.from({ length: NOTES }).map((_, i) => (
            <mesh key={i}>
              <octahedronGeometry args={[0.06, 0]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </Hotspot>
    </group>
  )
}