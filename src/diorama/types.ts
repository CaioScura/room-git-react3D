// ids dos projetos: é tudo que o quarto precisa saber sobre eles
export type ProjectId =
  | 'pomomates'
  | 'travel'
  | 'expression'
  | 'vila'
  | 'mood'
  | 'gatos'
  | 'jornada' // Jornada Milhas (avião na estante)
  | 'springapi' // API REST Spring Boot / Voll Med (caneca de café)

// "contrato" do componente: o que o portfólio passa e recebe
export type DioramaProps = {
  selected: ProjectId | null
  onSelect: (id: ProjectId | null) => void
  hovered: ProjectId | null
  onHover: (id: ProjectId | null) => void
}
