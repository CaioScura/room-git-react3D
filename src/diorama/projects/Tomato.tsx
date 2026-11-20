import { Hotspot } from '../../components/Hotspot'

const LEAVES = 5

// tomate-timer do Pomomates; a origem do grupo fica na base (onde encosta na mesa)
export function Tomato(props: { position: [number, number, number] }) {
  return (
    <Hotspot id="pomomates" label="Pomomates" position={props.position} labelOffset={[0, 0.95, 0]}>
      {/* anel no tampo: destaque do projeto principal */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.44, 32]} />
        <meshBasicMaterial color="#ffb4a8" transparent opacity={0.7} />
      </mesh>

      {/* corpo: esfera achatada no eixo Y */}
      <mesh castShadow position={[0, 0.27, 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[0.32, 24, 18]} />
        <meshStandardMaterial color="#e5483b" emissive="#ff3b2b" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>

      {/* folhas distribuídas em círculo e tombadas para fora */}
      {Array.from({ length: LEAVES }).map((_, i) => {
        const angle = (i / LEAVES) * Math.PI * 2
        return (
          <mesh
            key={i}
            castShadow
            position={[Math.cos(angle) * 0.1, 0.53, Math.sin(angle) * 0.1]}
            rotation={[Math.sin(angle) * 0.9, 0, -Math.cos(angle) * 0.9]}
          >
            <coneGeometry args={[0.04, 0.18, 4]} />
            <meshStandardMaterial color="#3f9b4b" />
          </mesh>
        )
      })}

      {/* cabinho */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 6]} />
        <meshStandardMaterial color="#2f7a3a" />
      </mesh>

      {/* marcação branca do timer na frente */}
      <mesh position={[0, 0.3, 0.29]}>
        <boxGeometry args={[0.03, 0.12, 0.02]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </Hotspot>
  )
}