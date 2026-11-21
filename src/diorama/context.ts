import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { DioramaProps } from './types'

// props (vêm de fora) + estado interno do quarto
export type DioramaContextValue = DioramaProps & {
  mood: number | null // índice em MOODS; null = música parada
  setMood: Dispatch<SetStateAction<number | null>>
}

export const DioramaContext = createContext<DioramaContextValue | null>(null)

// hook para ler o contexto; o erro avisa se alguém usar fora do Diorama
export function useDiorama() {
  const ctx = useContext(DioramaContext)
  if (!ctx) throw new Error('useDiorama precisa ser usado dentro do <Diorama>')
  return ctx
}
