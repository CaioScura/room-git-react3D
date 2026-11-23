import { Window } from './Window'
import { FairyLights } from './FairyLights'
import { FloorPlant, HangingPlant, SnakePlant } from './Plants'
import { Bookshelf } from './Bookshelf'
import { Rugs } from './Rugs'
import { FloorLamp } from './FloorLamp'
import { Corkboard } from './Corkboard'
import { Sofa } from './Sofa'
import { CoffeeTable } from './CoffeeTable'
import { Guitar } from './Guitar'
import { ArtCorner } from './ArtCorner'
import { WallArt } from './WallArt'
import { PALETTE } from '../utils/palette'

type Vec3 = [number, number, number]

// ganchos do pisca-pisca (fora do componente para não recriar o array a cada render)
const BACK_WALL_HOOKS: Vec3[] = [
  [-3.45, 3.85, -3.44],
  [-1.15, 3.85, -3.44],
  [1.15, 3.85, -3.44],
  [3.45, 3.85, -3.44],
]
const LEFT_WALL_HOOKS: Vec3[] = [
  [-3.44, 3.85, -3.45],
  [-3.44, 3.85, -1.15],
  [-3.44, 3.85, 1.15],
  [-3.44, 3.85, 3.45],
]

// "virado para dentro do quarto" quando encostado na parede da esquerda
const FACING_FROM_LEFT_WALL: Vec3 = [0, Math.PI / 2, 0]

// toda a decoração do quarto num lugar só: aqui fica O QUE vai ONDE
export function Decor() {
  return (
    <group>
      <Rugs />
      <FairyLights hooks={BACK_WALL_HOOKS} sag={0.25} />
      <FairyLights hooks={LEFT_WALL_HOOKS} sag={0.25} />

      {/* ── parede do fundo ── */}
      <Bookshelf position={[-2.75, 0, -3.33]} scale={0.75} />
      <Corkboard position={[0.95, 3.35, -3.46]} scale={0.7} />
      <Window position={[2.45, 0, -3.47]} />
      <FloorPlant position={[3.05, 0, -2.95]} scale={0.85} potColor={PALETTE.accentDeep} />

      {/* ── parede da esquerda (do fundo para a frente) ── */}
      <HangingPlant position={[-3.05, 2.55, -2.75]} hookHeight={0.9} />
      <FloorLamp position={[-3.1, 0, -0.75]} />
      <WallArt />
      <Sofa position={[-3.02, 0, 0.85]} rotation={FACING_FROM_LEFT_WALL} />
      {/* violão levemente virado para a câmera, para aparecer melhor */}
      <Guitar position={[-3.12, 0, 2.3]} rotation={[0, Math.PI / 2 - 0.35, 0]} />
      <SnakePlant position={[-3.05, 0, 3.12]} />

      {/* ── meio e frente ── */}
      <CoffeeTable position={[-2.0, 0, 0.85]} />
      <ArtCorner position={[2.2, 0, 0.7]} rotation={[0, Math.PI / 4, 0]} />
      <FloorPlant position={[3.05, 0, 3.0]} scale={0.65} />
    </group>
  )
}
