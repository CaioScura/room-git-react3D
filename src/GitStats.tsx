import styles from './Git.module.css'
import { timeAgo, type GitStatsData } from './gitStatsUtils'
import ContributionGraph from './ContributionGraph'
import LanguageBar from './LanguageBar'

// bloco de estatísticas do GitHub (topo do painel)
const GitStats = ({ stats }: { stats: GitStatsData }) => {
    const year = new Date().getFullYear()
    const thisYear = stats.days
        .filter((day) => day.date.startsWith(String(year)))
        .reduce((total, day) => total + day.count, 0)

    const cards = [
        { value: stats.publicRepos, label: 'repos públicos' },
        { value: thisYear, label: `commits em ${year}` },
        { value: stats.streakDays, label: 'dias seguidos' },
    ]

    return (
        <div className={styles.stats}>
            <span className={styles.eyebrow}>GitHub Status</span>
            <a className={styles.username} href={`https://github.com/${stats.username}`} target="_blank" rel="noreferrer">
                @{stats.username}
            </a>

            <div className={styles.statCards}>
                {cards.map((card) => (
                    <div key={card.label} className={styles.statCard}>
                        <b>{card.value}</b>
                        <span>{card.label}</span>
                    </div>
                ))}
            </div>

            <ContributionGraph days={stats.days} />
            <LanguageBar languages={stats.languages} />

            {stats.latestRepo && (
                <div className={`${styles.graphCard} ${styles.now}`}>
                    <span className={styles.pulse} />
                    <div>
                        <span className={styles.graphTitle}>Trabalhando agora em</span>
                        <a href={stats.latestRepo.url} target="_blank" rel="noreferrer">
                            <b>{stats.latestRepo.name}</b>
                        </a>{' '}
                        <small>· {timeAgo(stats.latestRepo.pushedAt)}</small>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GitStats