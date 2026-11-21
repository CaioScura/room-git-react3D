import { Box } from '../components/Box'
import { seededRandom } from '../utils/random'
import { PALETTE } from '../utils/palette'
import { Succulent } from './Plants'

const WOOD = PALETTE.wood
const WOOD_DARK = PALETTE.woodDark
const WIDTH = 1.8
const DEPTH = 0.46
const HEIGHT = 3.0
const SHELVES = [0.06, 0.8, 1.55, 2.3, 3.0] // altura de cada prateleira (a última é o topo)
const BOOK_COLORS = [PALETTE.accent, PALETTE.accentDeep, PALETTE.lilac, PALETTE.pink, PALETTE.ice, PALETTE.cream, '#2b2b44', '#4b4f9e', '#7b6fd6']

type Book = { x: number; width: number; height: number; color: string; tilt: number }

// gera uma fileira de livros até preencher a largura disponível
function makeRow(seed: number, from: number, to: number): Book[] {
  const random = seededRandom(seed)
  const books: Book[] = []
  let x = from
  while (true) {
    const width = 0.06 + random() * 0.06
    if (x + width > to) break
    books.push({
      x: x + width / 2,
      width,
      height: 0.38 + random() * 0.2,
      color: BOOK_COLORS[Math.floor(random() * BOOK_COLORS.length)],
      tilt: 0,
    })
    x += width + 0.005
  }
  // o último livro da fileira fica inclinado, encostado nos outros
  const last = books[books.length - 1]
  if (last) {
    last.tilt = -0.3
    last.x += 0.06
  }
  return books
}

// 3 prateleiras com livros; espaços livres viram lugar para vaso e porta-retrato
const ROWS = [
  { shelf: 1, books: makeRow(3, -0.82, 0.25) },
  { shelf: 2, books: makeRow(11, -0.4, 0.82) },
  { shelf: 3, books: makeRow(19, -0.82, 0.45) },
]

// estante; origem = centro da base. Montada "de frente" para +Z (girar para encostar na parede)
export function Bookshelf(props: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const inner = WIDTH - 0.1

  return (
    <group {...props}>
      {/* laterais, fundo e prateleiras */}
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.06, HEIGHT, DEPTH]} position={[side * (WIDTH / 2 - 0.03), HEIGHT / 2, 0]} color={WOOD} radius={0.015} />
      ))}
      <Box size={[WIDTH, HEIGHT, 0.03]} position={[0, HEIGHT / 2, -DEPTH / 2 + 0.015]} color={WOOD_DARK} />
      {SHELVES.map((y) => (
        <Box key={y} size={[inner, 0.05, DEPTH - 0.03]} position={[0, y, 0.015]} color={WOOD} />
      ))}

      {/* livros: em pé ("de lombada"), com a base apoiada na prateleira */}
      {ROWS.map(({ shelf, books }) =>
        books.map((book, i) => {
          const base = SHELVES[shelf] + 0.025
          return (
            <group key={`${shelf}-${i}`} position={[book.x, base, 0.02]} rotation={[0, 0, book.tilt]}>
              <Box size={[book.width, book.height, 0.3]} position={[0, book.height / 2, 0]} color={book.color} radius={0.008} />
            </group>
          )
        }),
      )}

      {/* decoração nos espaços livres */}
      <Succulent position={[0.55, SHELVES[1] + 0.025, 0.02]} />
      <group position={[-0.62, SHELVES[2] + 0.025, 0.05]} rotation={[-0.15, 0.3, 0]}>
        <Box size={[0.3, 0.36, 0.03]} position={[0, 0.18, 0]} color={PALETTE.cream} radius={0.01} />
        <Box size={[0.22, 0.27, 0.01]} position={[0, 0.18, 0.017]} color={PALETTE.accent} />
      </group>
      <Box size={[0.3, 0.3, 0.3]} position={[0.66, SHELVES[3] + 0.175, 0.02]} color={PALETTE.lilac} radius={0.03} />

      {/* prateleira de baixo: duas caixas organizadoras de "palha" */}
      {[-0.42, 0.42].map((x) => (
        <Box key={x} size={[0.72, 0.55, 0.38]} position={[x, SHELVES[0] + 0.3, 0.02]} color={PALETTE.slateBox} radius={0.04} />
      ))}
    </group>
  )
}
