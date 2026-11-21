import { getPomodoro } from './pomodoro'

export const SCREEN_W = 512
export const SCREEN_H = 300
const FOCUS_MINUTES = 25 // o ciclo acelerado é "exibido" como 25 min

// ajudante: círculo preenchido
function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

// desenha o "app" do Pomomates; lembre: no canvas, (0,0) é o canto superior esquerdo
export function drawScreen(ctx: CanvasRenderingContext2D, t: number) {
  const { isBreak, progress } = getPomodoro(t)

  // fundo e barra da janela com as 3 bolinhas
  ctx.fillStyle = '#1d1b2b'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  ctx.fillStyle = '#2a2740'
  ctx.fillRect(0, 0, SCREEN_W, 26)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => circle(ctx, 16 + i * 16, 13, 5, c))

  // título com um "tomatinho"
  circle(ctx, 32, 58, 9, '#e5483b')
  ctx.textAlign = 'left'
  ctx.fillStyle = '#e9e6ff'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('Pomomates', 48, 66)
  ctx.fillStyle = '#9b97c3'
  ctx.font = '15px sans-serif'
  ctx.fillText(isBreak ? 'Pausa — alongue-se!' : 'Sessão de foco', 22, 92)

  // anel de progresso: trilho cinza + arco colorido por cima
  const cx = 370, cy = 165, r = 85
  const start = -Math.PI / 2 // começa no topo (posição de 12h)
  ctx.lineWidth = 14
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#2f2c48'
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = isBreak ? '#4ade80' : '#ff6b5b'
  ctx.beginPath()
  ctx.arc(cx, cy, r, start, start + Math.PI * 2 * (isBreak ? 1 : progress))
  ctx.stroke()

  // tempo restante em mm:ss
  const remaining = Math.ceil(FOCUS_MINUTES * 60 * (1 - progress))
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  ctx.textAlign = 'center'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 40px monospace'
  ctx.fillText(isBreak ? '05:00' : `${mm}:${ss}`, cx, cy + 14)

  // "amigos focando" (a parte social do app)
  ctx.textAlign = 'left'
  ctx.fillStyle = '#9b97c3'
  ctx.font = '14px sans-serif'
  ctx.fillText('3 amigos focando agora', 22, 228)
  ;['#f59e0b', '#60a5fa', '#f472b6'].forEach((c, i) => circle(ctx, 36 + i * 30, 256, 12, c))
  circle(ctx, 130, 256, 5, '#4ade80') // bolinha verde de "online"
}
