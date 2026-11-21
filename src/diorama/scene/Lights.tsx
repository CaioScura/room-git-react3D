// luzes "de ambiente" do quarto, em tons frios (azul/roxo).
// A luz colorida do mood mora na luminária (decor/FloorLamp)
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#c7c4ff" />
      {/* hemisphere: "céu" lilás em cima, chão roxo-escuro embaixo */}
      <hemisphereLight args={['#c9c6ff', '#2a1f40', 0.7]} />
      {/* luz principal (luar entrando pela janela): faz as sombras */}
      <directionalLight
        castShadow
        position={[6, 11, 6]}
        intensity={1.35}
        color="#dcd8ff"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* luz de preenchimento azul vindo do lado da janela */}
      <pointLight position={[2.4, 2.6, -2.6]} intensity={4} distance={6} decay={1.5} color="#8fb4ff" />
    </>
  )
}
