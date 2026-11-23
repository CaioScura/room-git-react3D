import * as THREE from 'three'
import type { ProjectId } from '../types'

type Focus = {
  target: [number, number, number] // ponto para onde a câmera olha
  zoom: number // multiplicador do zoom que "cabe na tela" (1 = quarto inteiro)
}

// distância e direção fixas da câmera em relação ao alvo (ângulo isométrico)
export const CAMERA_OFFSET = new THREE.Vector3(10, 8.5, 10)

// quanto do mundo precisa caber na tela (o quarto agora é 7x7)
export const FIT_WIDTH = 10.6
export const FIT_HEIGHT = 9.2

// visão geral: o quarto inteiro
export const HOME: Focus = { target: [0, 1.85, -0.2], zoom: 1 }

// foco de cada projeto; o Record obriga a ter todos os ids
export const FOCUS: Record<ProjectId, Focus> = {
  pomomates: { target: [0.6, 1.95, -2.8], zoom: 2.0 },
  travel: { target: [-3.3, 2.5, 0.85], zoom: 2.0 },
  expression: { target: [-0.3, 2.8, -3.1], zoom: 2.4 },
  vila: { target: [-3.2, 3.05, -1.7], zoom: 2.4 },
  mood: { target: [-3.0, 1.2, -1.75], zoom: 2.4 },
  gatos: { target: [-2.95, 0.95, 1.15], zoom: 2.6 },
  jornada: { target: [-2.75, 2.6, -3.2], zoom: 2.4 },
  springapi: { target: [1.05, 1.9, -3.2], zoom: 2.8 },
}
