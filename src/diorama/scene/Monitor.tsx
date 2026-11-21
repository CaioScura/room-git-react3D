import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { drawScreen, SCREEN_W, SCREEN_H } from '../utils/drawScreen'

export function Monitor(props: { position: [number, number, number] }) {
  // cria o canvas e a textura UMA vez (useMemo com [] = só na primeira renderização)
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace // cores fiéis ao que desenhamos
    return { canvas, texture }
  }, [])

  // libera a memória da GPU quando o monitor sai da tela
  useEffect(() => () => texture.dispose(), [texture])

  const lastStep = useRef(-1)
  // ref do material: mexemos na textura por ele (refs podem ser alteradas no useFrame)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state) => {
    const map = materialRef.current?.map
    if (!map) return

    const t = state.clock.elapsedTime
    // redesenha só 4x por segundo: o "passo" muda a cada 0.25s
    const step = Math.floor(t * 4)
    if (step === lastStep.current) return
    lastStep.current = step

    drawScreen(canvas.getContext('2d')!, t)
    map.needsUpdate = true // avisa o three.js para reenviar a imagem para a GPU
  })

  return (
    <group position={props.position}>
      <Box size={[0.5, 0.04, 0.3]} position={[0, 0.02, 0]} color="#2b2b38" />
      <Box size={[0.1, 0.45, 0.08]} position={[0, 0.25, -0.02]} color="#2b2b38" />
      <Box size={[1.95, 1.18, 0.08]} position={[0, 0.82, 0]} color="#22212e" />

      {/* a tela agora usa a textura em vez de uma cor lisa */}
      <mesh position={[0, 0.82, 0.045]}>
        <planeGeometry args={[1.83, 1.07]} />
        <meshBasicMaterial ref={materialRef} map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}