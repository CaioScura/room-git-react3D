import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { useDiorama } from '../context'
import { MOODS } from '../utils/moods'
import { PALETTE } from '../utils/palette'
import { playTone } from '../utils/sound'

const NOTES = 3

export function RecordPlayer() {
  const { mood, setMood } = useDiorama()
  const disc = useRef<THREE.Group>(null!)
  const notes = useRef<THREE.Group>(null!)
  const playing = mood !== null
  const color = playing ? MOODS[mood].color : '#e5483b'

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (playing) disc.current.rotation.y += delta * 3
    notes.current.visible = playing
    notes.current.children.forEach((note, i) => {
      const c = (t * 0.6 + i / NOTES) % 1
      note.position.set(Math.sin(c * 6 + i) * 0.15, 0.3 + c * 0.9, 0)
      note.scale.setScalar(Math.sin(c * Math.PI))
    })
  })

  function nextMood() {
    setMood((current) => (current === null ? 0 : (current + 1) % MOODS.length))
    playTone([392, 494, 587], 0.6, 'triangle')
  }

  return (
    // escala 0.8 e girado 90°: a mesinha fica com o lado comprido encostado na parede
    <group position={[-3.05, 0, -1.75]} rotation={[0, Math.PI / 2, 0]} scale={0.8}>
      <Box size={[1.2, 0.08, 1.0]} position={[0, 1.0, 0]} color={PALETTE.wood} radius={0.03} />
      {[[-0.5, -0.4], [0.5, -0.4], [-0.5, 0.4], [0.5, 0.4]].map(([x, z], i) => (
        <Box key={i} size={[0.07, 1.0, 0.07]} position={[x, 0.5, z]} color={PALETTE.woodDark} />
      ))}
      {/* pilha de discos embaixo da mesinha */}
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} size={[0.62, 0.03, 0.62]} position={[0.05 * (i % 2), 0.05 + i * 0.035, 0]} color={['#2b2b44', PALETTE.accentDeep, PALETTE.pink, PALETTE.ice][i]} />
      ))}

      <Hotspot id="mood" label="Mood Player" position={[0, 1.04, 0]} labelOffset={[0, 1.4, 0]} onActivate={nextMood}>
        <Box size={[0.95, 0.14, 0.75]} position={[0, 0.07, 0]} color="#2a2340" radius={0.03} />
        <group ref={disc} position={[-0.08, 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
            <meshStandardMaterial color="#111" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <Box size={[0.04, 0.012, 0.04]} position={[0.06, 0.02, 0]} color="#fff" />
        </group>
        <Box size={[0.04, 0.04, 0.45]} position={[0.33, 0.2, -0.05]} rotation={[0, 0.35, 0]} color="#cccccc" />
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
