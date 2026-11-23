import styles from './Git.module.css'
import type { ContributionDay } from './gitStatsUtils'

// "2026-11-21" → "21/11/2026"
const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')

// mapa de contribuições: um quadradinho por dia, colunas = semanas
const ContributionGraph = ({ days }: { days: ContributionDay[] }) => {
    // o primeiro dia pode ser, por exemplo, uma quarta-feira. Para ele cair na linha certa,
    // colocamos quadradinhos vazios antes (0 = domingo ... 6 = sábado)
    const emptyCells = days.length > 0 ? new Date(`${days[0].date}T00:00:00`).getDay() : 0

    return (
        <div className={styles.graphCard}>
            <span className={styles.graphTitle}>Contribuições no último ano</span>

            <div className={styles.graph}>
                {Array.from({ length: emptyCells }).map((_, i) => (
                    <span key={`empty-${i}`} />
                ))}

                {days.map((day) => (
                    <span
                        key={day.date}
                        data-level={day.level}
                        title={`${day.count} contribuições em ${formatDate(day.date)}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ContributionGraph