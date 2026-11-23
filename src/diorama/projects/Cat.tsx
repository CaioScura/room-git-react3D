import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from '../components/Hotspot'
import { SpeechBubble } from '../components/SpeechBubble'
import { playTone } from '../utils/sound'

const FUR = '#f2a65a' // laranja
const STRIPE = '#d47f2c' // listras mais escuras
const WHITE = '#fff4e6' // focinho e patinhas
const PINK = '#f4a0ae' // nariz e dentro das orelhas
const EYE = '#7ccf6a'
const AWAKE_MS = 3000

const { damp } = THREE.MathUtils

// gato laranja deitado em "pãozinho" na almofada da frente do sofá
// (montado com a cabeça para +X; girado −90° em Y para a cabeça apontar para +Z, ao longo do sofá)
export function Cat() {
  const [awake, setAwake] = useState(false) // estado local: só o gato precisa saber
  const body = useRef<THREE.Group>(null!)
  const torso = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  const tail = useRef<THREE.Group>(null!)
  const timer = useRef<number | undefined>(undefined)

  // rabo: um "tubo" que segue uma curva que contorna o corpo pela frente
  const tailGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, 0.12, 0),
      new THREE.Vector3(-0.36, 0.06, 0.12),
      new THREE.Vector3(-0.2, 0.04, 0.24),
      new THREE.Vector3(0.05, 0.04, 0.26),
      new THREE.Vector3(0.2, 0.05, 0.2),
    ])
    return new THREE.TubeGeometry(curve, 24, 0.035, 8, false)
  }, [])
  useEffect(() => () => tailGeometry.dispose(), [tailGeometry])

  // se o componente sair da tela com o timer rodando, cancela
  useEffect(() => () => clearTimeout(timer.current), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // acordado: flutua (é um Gato Flutuante!); dormindo: fica deitado na mesa
    const targetY = awake ? 0.4 + Math.sin(t * 4) * 0.05 : 0
    body.current.position.y = damp(body.current.position.y, targetY, 6, delta)

    // dormindo: o corpo "respira"
    torso.current.scale.y = awake ? 1 : 1 + Math.sin(t * 2) * 0.035

    // cabeça: dormindo fica baixa e apoiada; acordado levanta e inclina, curiosa
    head.current.position.y = damp(head.current.position.y, awake ? 0.36 : 0.22, 8, delta)
    head.current.rotation.z = damp(head.current.rotation.z, awake ? 0.15 : -0.15, 8, delta)
    head.current.rotation.x = damp(head.current.rotation.x, awake ? Math.sin(t * 3) * 0.15 : 0, 8, delta)

    // rabo: balança rápido acordado, quase parado dormindo
    tail.current.rotation.y = awake ? Math.sin(t * 8) * 0.25 : Math.sin(t * 0.8) * 0.05
  })

  function wakeUp() {
    setAwake(true)
    playTone([720, 880, 520], 0.45, 'sawtooth')
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAwake(false), AWAKE_MS)
  }

  return (
    <Hotspot
      id="gatos"
      label="Gatos Flutuantes"
      position={[-2.95, 0.6, 1.15]}
      rotation={[0, -Math.PI / 2, 0]}
      labelOffset={[0, 1.0, 0]}
      onActivate={wakeUp}
    >
      <group ref={body}>
        {/* corpo: cápsula deitada (girada 90° em Z), um pouco achatada */}
        <group ref={torso} position={[0, 0.15, 0]}>
          <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]} scale={[0.9, 1, 1]}>
            <capsuleGeometry args={[0.15, 0.3, 6, 16]} />
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>
          {/* listras: arcos de toro passando por cima das costas */}
          {[-0.14, -0.02, 0.1].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 0.9, 1]}>
              <torusGeometry args={[0.152, 0.018, 6, 20, Math.PI]} />
              <meshStandardMaterial color={STRIPE} roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* patinhas da frente, brancas, saindo de baixo do peito */}
        {[-0.07, 0.07].map((z) => (
          <mesh key={z} castShadow position={[0.27, 0.035, z]} scale={[1.5, 0.6, 1]}>
            <sphereGeometry args={[0.045, 12, 10]} />
            <meshStandardMaterial color={WHITE} />
          </mesh>
        ))}

        {/* rabo (geometria criada acima) */}
        <group ref={tail}>
          <mesh castShadow geometry={tailGeometry}>
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>
        </group>

        {/* cabeça: o grupo é o "pescoço" (pivô) */}
        <group ref={head} position={[0.3, 0.22, 0]}>
          <mesh castShadow scale={[0.95, 0.88, 1]}>
            <sphereGeometry args={[0.14, 20, 16]} />
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>

          {/* orelhas: cones laranja com um cone rosa menor na frente */}
          {[-1, 1].map((side) => (
            <group key={side} position={[0, 0.1, side * 0.075]} rotation={[side * 0.35, 0, 0]}>
              <mesh castShadow position={[0, 0.04, 0]}>
                <coneGeometry args={[0.055, 0.1, 12]} />
                <meshStandardMaterial color={FUR} />
              </mesh>
              <mesh position={[0.02, 0.035, 0]} scale={[0.5, 0.75, 0.6]}>
                <coneGeometry args={[0.055, 0.1, 12]} />
                <meshStandardMaterial color={PINK} />
              </mesh>
            </group>
          ))}

          {/* focinho branco + nariz rosa */}
          <mesh position={[0.1, -0.04, 0]} scale={[0.7, 0.6, 1.1]}>
            <sphereGeometry args={[0.07, 14, 10]} />
            <meshStandardMaterial color={WHITE} />
          </mesh>
          <mesh position={[0.145, -0.01, 0]}>
            <sphereGeometry args={[0.016, 8, 6]} />
            <meshStandardMaterial color={PINK} />
          </mesh>

          {/* olhos: fechados = tracinho escuro; abertos = olho verde com pupila de fenda */}
          {[-1, 1].map((side) => (
            <group key={side} position={[0.115, 0.03, side * 0.06]}>
              {awake ? (
                <>
                  <mesh scale={[0.5, 1, 1]}>
                    <sphereGeometry args={[0.028, 12, 10]} />
                    <meshStandardMaterial color={EYE} roughness={0.3} />
                  </mesh>
                  <mesh position={[0.012, 0, 0]}>
                    <boxGeometry args={[0.006, 0.04, 0.01]} />
                    <meshBasicMaterial color="#111" />
                  </mesh>
                </>
              ) : (
                <mesh rotation={[side * 0.25, 0, 0]}>
                  <boxGeometry args={[0.01, 0.008, 0.045]} />
                  <meshBasicMaterial color="#3a2414" />
                </mesh>
              )}
            </group>
          ))}

          {/* bigodes: 2 fios finos de cada lado, abrindo em leque */}
          {[-1, 1].map((side) =>
            [-0.12, 0.12].map((tilt) => (
              <mesh key={`${side}${tilt}`} position={[0.12, -0.04, side * 0.09]} rotation={[tilt, side * 0.25, 0]}>
                <boxGeometry args={[0.004, 0.004, 0.13]} />
                <meshBasicMaterial color="#fffaf0" />
              </mesh>
            )),
          )}
        </group>
      </group>

      {awake && <SpeechBubble position={[0.4, 0.95, 0]} text="miau!" />}
    </Hotspot>
  )
}
