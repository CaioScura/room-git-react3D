import { createContext, useContext } from 'react'
import type { DioramaProps } from './types'

// o contexto guarda exatamente as props que o Diorama recebeu
export const DioramaContext = createContext<DioramaProps | null>(null)

// hook para ler o contexto; o erro avisa se alguém usar fora do Diorama
export function useDiorama() {
  const ctx = useContext(DioramaContext)
  if (!ctx) throw new Error('useDiorama precisa ser usado dentro do <Diorama>')
  return ctx
}