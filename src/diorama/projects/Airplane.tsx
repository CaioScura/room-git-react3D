import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { Hotspot } from '../components/Hotspot'
import { PALETTE } from '../utils/palette'
import { useDiorama } from '../context'
import { playTone } from '../utils/sound'

// onde fica o topo da estante no mundo (estante com escala 0.75) e a altura do avião no suporte
const STAND_POSITION = new THREE.Vector3(-2.75, 2.27, -3.3)
const REST_HEIGHT = 0.3
const FLIGHT_SECONDS = 7

// rota do voo, em coordenadas do MUNDO: decola da estante, dá a volta no quarto e pousa
const FLIGHT_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.75, 2.57, -3.3), // no suporte (nariz apontando para +X)
  new THREE.Vector3(-1.6, 2.75, -2.7),
  new THREE.Vector3(0.3, 3.3, -1.8),
  new THREE.Vector3(2.1, 3.6, -0.2),
  new THREE.Vector3(1.8, 3.6, 2.0),
  new THREE.Vector3(-0.4, 3.5, 2.6),
  new THREE.Vector3(-2.3, 3.3, 1.4),
  new THREE.Vector3(-3.0, 3.1, -0.9),
  new THREE.Vector3(-3.3, 2.8, -3.0),
  new THREE.Vector3(-2.75, 2.57, -3.3), // de volta ao suporte
])

// vetores reaproveitados (nada de "new" dentro do useFrame)
const point = new THREE.Vector3()
const tangent = new THREE.Vector3()
const lookTarget = new THREE.Vector3()

// suaviza o começo e o fim do voo (acelera na decolagem, freia no pouso)
const easeInOut = (x: number) => x * x * (3 - 2 * x)

// avião de brinquedo do Jornada Milhas, em cima da estante; o nariz aponta para +Z
export function Airplane() {
  const { hovered } = useDiorama()
  const plane = useRef<THREE.Group>(null!)
  const propeller = useRef<THREE.Mesh>(null!)
  const flightStart = useRef<number | null>(null) // null = parado no suporte
  const takeOffRequested = useRef(false) // o clique "pede", o useFrame "decola"
  const propellerSpeed = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // o clique só marca o pedido; aqui, com o relógio da cena em mãos, o voo começa
    if (takeOffRequested.current) {
      takeOffRequested.current = false
      if (flightStart.current === null) flightStart.current = t
    }
    const flying = flightStart.current !== null

    // hélice: parada no suporte, gira no hover, gira MUITO voando
    const targetSpeed = flying ? 40 : hovered === 'jornada' ? 15 : 0
    propellerSpeed.current = THREE.MathUtils.damp(propellerSpeed.current, targetSpeed, 4, delta)
    propeller.current.rotation.z += propellerSpeed.current * delta

    if (!flying) {
      // parado: em cima do suporte, com o nariz para a direita (+X), paralelo à parede
      plane.current.position.set(0, REST_HEIGHT, 0)
      plane.current.rotation.set(0, Math.PI / 2, 0)
      return
    }

    // 1) quanto do voo já passou (0 → 1)
    const progress = Math.min((t - flightStart.current!) / FLIGHT_SECONDS, 1)
    const p = easeInOut(progress)

    // 2) ponto da curva e direção em que ela "anda" naquele ponto
    FLIGHT_PATH.getPointAt(p, point)
    FLIGHT_PATH.getTangentAt(p, tangent)

    // 3) a curva está no mundo; o avião está dentro do grupo da estante → converte
    plane.current.position.copy(point).sub(STAND_POSITION)
    // lookAt usa coordenadas do MUNDO: "olhe para um ponto um pouco à frente na curva"
    lookTarget.copy(point).add(tangent)
    plane.current.lookAt(lookTarget)

    // 4) inclina as asas nas curvas, como um avião de verdade
    plane.current.rotateZ(Math.sin(progress * Math.PI * 2) * 0.35)

    if (progress >= 1) flightStart.current = null // pousou
  })

  function takeOff() {
    if (flightStart.current !== null) return // já está voando
    takeOffRequested.current = true
    playTone([220, 330, 440], 0.8, 'triangle') // "vruuum" subindo
  }

  return (
    <Hotspot
      id="jornada"
      label="Jornada Milhas"
      position={STAND_POSITION.toArray()}
      labelOffset={[0, 0.8, 0]}
      onActivate={takeOff}
    >
      {/* suporte: base + haste */}
      <Box size={[0.3, 0.03, 0.3]} position={[0, 0.015, 0]} color="#2a2340" radius={0.01} />
      <mesh castShadow position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* o avião (nariz em +Z local) */}
      <group ref={plane}>
        {/* fuselagem: cápsula deitada ao longo de Z */}
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.07, 0.36, 6, 14]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
        </mesh>
        {/* janelinhas */}
        {[-0.08, 0, 0.08].map((z) => (
          <mesh key={z} position={[0.066, 0.025, z]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <meshStandardMaterial color="#3b6e8f" />
          </mesh>
        ))}
        {/* asas, estabilizador traseiro e leme */}
        <Box size={[0.75, 0.025, 0.14]} position={[0, -0.01, 0.03]} color={PALETTE.accentDeep} radius={0.01} />
        <Box size={[0.3, 0.02, 0.08]} position={[0, 0.01, -0.23]} color={PALETTE.accentDeep} radius={0.008} />
        <Box size={[0.02, 0.14, 0.1]} position={[0, 0.08, -0.23]} color={PALETTE.pink} radius={0.008} />
        {/* nariz + hélice (gira em volta de Z) */}
        <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.045, 0.06, 12]} />
          <meshStandardMaterial color={PALETTE.pink} />
        </mesh>
        <mesh ref={propeller} position={[0, 0, 0.3]}>
          <boxGeometry args={[0.3, 0.03, 0.01]} />
          <meshStandardMaterial color="#3b2a20" />
        </mesh>
      </group>
    </Hotspot>
  )
}
