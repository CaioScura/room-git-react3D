    // ids dos 6 projetos: é tudo que o quarto precisa saber sobre eles
export type ProjectId = 'pomomates' | 'travel' | 'expression' | 'vila' | 'mood' | 'gatos'

// "contrato" do componente: o que o portfólio passa e recebe
export type DioramaProps = {
  selected: ProjectId | null
  onSelect: (id: ProjectId | null) => void
}