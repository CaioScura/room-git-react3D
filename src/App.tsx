import { useState } from 'react'
import { Diorama, type ProjectId } from './diorama'

export default function App() {
  // os dois estados moram aqui (no portfólio, vão alimentar o painel também)
  const [selected, setSelected] = useState<ProjectId | null>(null)
  const [hovered, setHovered] = useState<ProjectId | null>(null)

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Diorama selected={selected} onSelect={setSelected} hovered={hovered} onHover={setHovered} />

      {/* debug: mostra o que o quarto está "avisando" */}
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#fff', fontFamily: 'monospace' }}>
        hover: {hovered ?? '—'} | selecionado: {selected ?? '—'}
      </div>
    </div>
  )
}