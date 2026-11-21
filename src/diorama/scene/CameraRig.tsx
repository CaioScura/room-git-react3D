import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useDiorama } from '../context'
import { CAMERA_OFFSET, FIT_HEIGHT, FIT_WIDTH, FOCUS, HOME } from '../utils/cameraPoints'

// vetores reaproveitados em todos os frames (nada de "new" dentro do useFrame)
const goal = new THREE.Vector3()
const offsetGoal = new THREE.Vector3()

export function CameraRig() {
  const { selected } = useDiorama()
  const camera = useThree((state) => state.camera) as THREE.OrthographicCamera
  const size = useThree((state) => state.size)

  const lookAt = useRef(new THREE.Vector3(...HOME.target))
  const offset = useRef(CAMERA_OFFSET.clone())

  // A câmera de Three.js é um recurso imperativo externo e precisa ser atualizada a cada frame.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((state, delta) => {
    const focus = selected ? FOCUS[selected] : HOME
    const fraction = 1 - Math.exp(-delta * 3.5)

    // 1) alvo: desliza até o ponto do projeto (ou da visão geral)
    goal.set(...focus.target)
    lookAt.current.lerp(goal, fraction)

    // 2) ângulo: na visão geral, inclina de leve seguindo o mouse
    offsetGoal.copy(CAMERA_OFFSET)
    if (!selected) {
      offsetGoal.x += state.pointer.x * 1.2
      offsetGoal.z -= state.pointer.x * 1.2
      offsetGoal.y += state.pointer.y * 0.8
    }
    offset.current.lerp(offsetGoal, fraction)

    // 3) posiciona a câmera (alvo + haste) e aponta para o alvo
    camera.position.copy(lookAt.current).add(offset.current)
    camera.lookAt(lookAt.current)

    // 4) zoom: o que cabe na tela × multiplicador do foco
    const fit = Math.min(size.width / FIT_WIDTH, size.height / FIT_HEIGHT)
    // A câmera é um recurso imperativo externo e deve ser atualizada a cada frame.
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = THREE.MathUtils.damp(camera.zoom, fit * focus.zoom, 3.5, delta)
    camera.updateProjectionMatrix()
  })

  return null
}
