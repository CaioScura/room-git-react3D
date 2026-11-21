import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, type ThreeElements, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useDiorama } from '../context'
import type { ProjectId } from '../types'

// Omit 'id': o group do three já tem "id: number"; somado ao nosso "id: ProjectId" (string)
// o tipo vira never e o TS reclama no "...props"
type HotspotProps = Omit<ThreeElements['group'], 'id'> & {
  id: ProjectId
  label: string
  labelOffset?: [number, number, number]
}

export function Hotspot({ id, label, labelOffset = [0, 1, 0], children, ...props }: HotspotProps) {
  const { hovered, onHover, onSelect } = useDiorama()
  const isHovered = hovered === id
  const ref = useRef<THREE.Group>(null!)

  // a cada frame, o tamanho anda um pouco em direção ao alvo
  useFrame((_, delta) => {
    const target = isHovered ? 1.1 : 1
    const s = THREE.MathUtils.damp(ref.current.scale.x, target, 12, delta)
    ref.current.scale.setScalar(s) // setScalar = mesmo valor em x, y e z
  })

  function handleOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    onHover(id)
    document.body.style.cursor = 'pointer'
  }

  function handleOut() {
    onHover(null)
    document.body.style.cursor = 'auto'
  }

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    onSelect(id)
  }

  return (
    <group ref={ref} {...props} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      {children}
      {isHovered && (
        <Html position={labelOffset} center style={{ pointerEvents: 'none' }}>
          <div style={tagStyle}>{label}</div>
        </Html>
      )}
    </group>
  )
}

const tagStyle: React.CSSProperties = {
  font: '600 12px monospace',
  background: '#13111c',
  color: '#fff',
  border: '1px solid #6b5b95',
  padding: '4px 9px',
  borderRadius: 7,
  whiteSpace: 'nowrap',
}