import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from '../components/Hotspot'
import { SpeechBubble } from '../components/SpeechBubble'
import { useDiorama } from '../context'
import { playTone } from '../utils/sound'

// Java = café ☕: a caneca representa a API REST em Spring Boot (Voll Med)
const RESPONSES = [
  'POST /login → 200 OK 🔑',
  'GET /medicos → 200 OK',
  'POST /consultas → 201 Created',
  'DELETE /consultas → 204 No Content',
]
const STEAM_PUFFS = 5
const MUG_R = 0.13
const MUG_H = 0.26
const BUBBLE_MS = 2500

export function CoffeeMug() {
  const { hovered } = useDiorama()
  const isHovered = hovered === 'springapi'
  const [response, setResponse] = useState<string | null>(null)
  const nextResponse = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const steam = useRef<THREE.Group>(null!)

  // cada fumacinha tem o PRÓPRIO material, para cada uma sumir (opacidade) no seu tempo
  const steamMaterials = useMemo(
    () =>
      Array.from({ length: STEAM_PUFFS }, () =>
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false }),
      ),
    [],
  )
  useEffect(() => () => steamMaterials.forEach((m) => m.dispose()), [steamMaterials])
  useEffect(() => () => clearTimeout(timer.current), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = isHovered || response ? 0.9 : 0.45 // no hover o café "ferve" mais
    steam.current.children.forEach((puff, i) => {
      const c = (t * speed + i / STEAM_PUFFS) % 1 // ciclo de 0 a 1 (igual às notas do toca-discos)
      puff.position.set(Math.sin(c * 5 + i * 2) * 0.05, c * 0.6, Math.cos(c * 4 + i) * 0.03)
      puff.scale.setScalar(0.5 + c * 1.2) // vai se espalhando ao subir
      steamMaterials[i].opacity = Math.sin(c * Math.PI) * 0.55 // aparece e some
    })
  })

  // cada clique mostra a "resposta" de um endpoint da API
  function callApi() {
    setResponse(RESPONSES[nextResponse.current])
    nextResponse.current = (nextResponse.current + 1) % RESPONSES.length
    playTone([880, 1320], 0.25, 'sine') // "plim"
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setResponse(null), BUBBLE_MS)
  }

  return (
    <Hotspot id="springapi" label="API REST · Spring Boot" position={[1.05, 1.55, -3.25]} labelOffset={[0, 0.85, 0]} onActivate={callApi}>
      {/* caneca: cilindro + café (disco escuro) logo abaixo da borda */}
      <mesh castShadow receiveShadow position={[0, MUG_H / 2, 0]}>
        <cylinderGeometry args={[MUG_R, MUG_R * 0.92, MUG_H, 24]} />
        <meshStandardMaterial color="#e4e2ff" roughness={0.5} />
      </mesh>
      <mesh position={[0, MUG_H - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[MUG_R * 0.88, 24]} />
        <meshStandardMaterial color="#4a2c1a" roughness={0.3} />
      </mesh>

      {/* alça: meio toro (arco de 180°) em pé, do lado direito */}
      <mesh castShadow position={[MUG_R, MUG_H / 2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.065, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#e4e2ff" roughness={0.5} />
      </mesh>

      {/* folhinha verde na frente (verde do Spring), virada para a câmera */}
      <group position={[Math.sin(Math.PI / 4) * MUG_R, MUG_H / 2, Math.cos(Math.PI / 4) * MUG_R]} rotation={[0, Math.PI / 4, 0]}>
        <mesh rotation={[0, 0, 0.6]} scale={[0.5, 1, 0.15]}>
          <sphereGeometry args={[0.05, 12, 8]} />
          <meshStandardMaterial color="#6db33f" />
        </mesh>
      </group>

      {/* vapor */}
      <group ref={steam} position={[0, MUG_H + 0.05, 0]}>
        {steamMaterials.map((material, i) => (
          <mesh key={i} material={material}>
            <sphereGeometry args={[0.05, 10, 8]} />
          </mesh>
        ))}
      </group>

      {response && <SpeechBubble position={[0, 1.0, 0]} text={response} />}
    </Hotspot>
  )
}
