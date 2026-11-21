// ciclo acelerado: 13.5s de foco + 2.5s de pausa
export const CYCLE = 16
export const FOCUS = 13.5

// função pura: dado o tempo, diz em que fase do pomodoro estamos
export function getPomodoro(t: number) {
  const inCycle = t % CYCLE // "%" faz o tempo voltar a 0 a cada 16s
  return {
    isBreak: inCycle > FOCUS,
    progress: Math.min(inCycle / FOCUS, 1), // 0 → 1 durante o foco
  }
}