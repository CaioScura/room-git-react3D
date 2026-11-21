import type { CSSProperties } from 'react'
import { Html } from '@react-three/drei'

// balão de fala preso a um ponto 3D (usado pelo gato e pela caneca)
export function SpeechBubble({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div style={bubbleStyle}>{text}</div>
    </Html>
  )
}

const bubbleStyle: CSSProperties = {
  font: '700 13px sans-serif',
  background: '#fff',
  color: '#13111c',
  padding: '4px 10px',
  borderRadius: '12px 12px 12px 2px', // canto "cortado" = balão de fala
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 12px rgba(0,0,0,.25)',
}
