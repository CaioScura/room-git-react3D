// um único AudioContext para o app todo (criar vários é caro)
let audioCtx: AudioContext | null = null

// toca uma sequência de notas curtas; frequencies em Hz
export function playTone(frequencies: number[], duration = 0.5, type: OscillatorType = 'sine') {
  try {
    audioCtx ??= new AudioContext() // cria só na primeira vez (precisa vir de um clique)
    const now = audioCtx.currentTime

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type

    // divide a duração entre as notas: cada uma começa um pouco depois da anterior
    frequencies.forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, now + (i * duration) / frequencies.length)
    })

    // envelope de volume: sobe rápido (0.03s) e desce até o fim, sem "clique"
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(gain).connect(audioCtx.destination) // oscilador → volume → alto-falante
    osc.start(now)
    osc.stop(now + duration + 0.05)
  } catch {
    // som é um detalhe: se o navegador bloquear, segue sem som
  }
}
