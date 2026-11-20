import { Html } from '@react-three/drei'
import type { ThreeElements, ThreeEvent } from '@react-three/fiber'
import { useDiorama } from '../diorama/context'
import type { ProjectId } from '../diorama/types'

// Omit 'id': o group do three já tem um "id: number"; somado ao nosso "id: ProjectId" (string)
// o tipo vira never e o TS reclama no "...props"
type HotspotProps = Omit<ThreeElements['group'], 'id'> & {
  id: ProjectId
  label: string
  labelOffset?: [number, number, number] // onde a etiqueta aparece, relativo ao objeto
}

export function Hotspot({ id, label, labelOffset: labelOffsetProp, children, ...props }: HotspotProps) {
  const labelOffset: [number, number, number] = labelOffsetProp ?? [0, 1, 0]
  const { hovered, onHover, onSelect } = useDiorama()
  const isHovered = hovered === id

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
  }

  return (
    <group
      {...props}
      scale={isHovered ? 1.1 : 1}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      {children}

      {/* Html do drei: coloca um elemento HTML "preso" a um ponto do 3D */}
      {isHovered && (
        <Html position={labelOffset} center style={{ pointerEvents: 'none' }}>
          <div style={tagStyle}>{label}</div>
        </Html>
      )}
    </group>
  )
}

// estilo inline (e não num .css) para a pasta diorama continuar independente
const tagStyle: React.CSSProperties = {
  font: '600 12px monospace',
  background: '#13111c',
  color: '#fff',
  border: '1px solid #6b5b95',
  padding: '4px 9px',
  borderRadius: 7,
  whiteSpace: 'nowrap',
}