// gerador de números "aleatórios" com semente: sempre gera a MESMA sequência.
// Assim os livros da estante saem iguais toda vez que a página carrega.
export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280 // número entre 0 e 1
  }
}
