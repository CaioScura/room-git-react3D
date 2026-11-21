import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '../components/Box'
import { drawScreen, SCREEN_W, SCREEN_H } from '../utils/drawScreen'

// monitor com o "Pomomates" rodando (textura de canvas atualizada 4x por segundo)
export function Monitor(props: { position: [number, number, number] }) {
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return { canvas, texture }
  }, [])

  // libera a memória da GPU quando o monitor sai da tela
  useEffect(() => () => texture.dispose(), [texture])

  const lastStep = useRef(-1)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const step = Math.floor(t * 4)
    if (step === lastStep.current) return
    lastStep.current = step
    drawScreen(canvas.getContext('2d')!, t)
    texture.needsUpdate = true // avisa o three.js para reenviar a imagem para a GPU
  })

  return (
    <group position={props.position}>
      <Box size={[0.5, 0.04, 0.3]} position={[0, 0.02, 0]} color="#2b2b38" radius={0.015} />
      <Box size={[0.1, 0.45, 0.08]} position={[0, 0.25, -0.02]} color="#2b2b38" />
      <Box size={[1.95, 1.18, 0.08]} position={[0, 0.82, 0]} color="#22212e" radius={0.035} />
      <mesh position={[0, 0.82, 0.045]}>
        <planeGeometry args={[1.83, 1.07]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
