import { useRef, type CSSProperties } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, type ThreeElements, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useDiorama } from '../context'
import type { ProjectId } from '../types'

// Omit 'id': todo objeto do three.js já tem um "id" numérico, que brigaria com o nosso
type HotspotProps = Omit<ThreeElements['group'], 'id'> & {
  id: ProjectId
  label: string
  labelOffset?: [number, number, number] // onde a etiqueta aparece, relativo ao objeto
  onActivate?: () => void // ação extra do objeto ao ser clicado
}

// embrulha um objeto e o torna clicável: hover, clique e etiqueta
export function Hotspot({ id, label, labelOffset = [0, 1, 0], onActivate, children, ...props }: HotspotProps) {
  const { hovered, onHover, onSelect } = useDiorama()
  const isHovered = hovered === id
  const ref = useRef<THREE.Group>(null!)

  // a cada frame, o tamanho anda um pouco em direção ao alvo
  useFrame((_, delta) => {
    const target = isHovered ? 1.1 : 1
    const s = THREE.MathUtils.damp(ref.current.scale.x, target, 12, delta)
    ref.current.scale.setScalar(s)
  })

  function handleOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation() // só o objeto mais próximo da câmera reage
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
    onActivate?.()
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

// estilo inline (e não num .css) para a pasta diorama continuar independente
const tagStyle: CSSProperties = {
  font: '600 12px monospace',
  background: '#13111c',
  color: '#fff',
  border: '1px solid #6b5b95',
  padding: '4px 9px',
  borderRadius: 7,
  whiteSpace: 'nowrap',
}
