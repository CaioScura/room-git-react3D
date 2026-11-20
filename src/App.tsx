import { useState } from 'react'
import { Diorama, type ProjectId } from './diorama'

export default function App() {
  // esse estado vai morar no portfólio: é ele que liga quarto e painel
  const [selected, setSelected] = useState<ProjectId | null>(null)

  return (
    <div style={{ height: '100vh' }}>
      <Diorama selected={selected} onSelect={setSelected} />
    </div>
  )
}