import { useEffect, useState } from 'react'
import { Diorama, type ProjectId } from './diorama'

export default function App() {
  const [selected, setSelected] = useState<ProjectId | null>(null)
  const [hovered, setHovered] = useState<ProjectId | null>(null)

  // Esc volta para a visão geral
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown) // limpeza ao desmontar
  }, [])

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Diorama selected={selected} onSelect={setSelected} hovered={hovered} onHover={setHovered} />

      <div style={{ position: 'absolute', top: 16, left: 16, color: '#fff', fontFamily: 'monospace' }}>
        hover: {hovered ?? '—'} | selecionado: {selected ?? '—'}
      </div>

      {selected && (
        <button
          onClick={() => setSelected(null)}
          style={{ position: 'absolute', top: 48, left: 16, padding: '6px 12px', cursor: 'pointer' }}
        >
          ← voltar ao quarto (Esc)
        </button>
      )}
    </div>
  )
}