import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

// pós-processamento: efeitos aplicados na imagem final, depois que a cena é desenhada
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      {/* bloom: só o que for MAIS claro que 1 "vaza" luz (lâmpadas, pisca-pisca) */}
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.9} />
      {/* devolve o ajuste de cor "de cinema" que o R3F fazia sozinho */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
