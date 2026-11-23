import styles from './Git.module.css'
import type { LanguageStat } from './gitStatsUtils'

// barra colorida + legenda das linguagens mais usadas
const LanguageBar = ({ languages }: { languages: LanguageStat[] }) => {
    if (languages.length === 0) return null // sem dados: não mostra nada

    return (
        <div className={styles.graphCard}>
            <span className={styles.graphTitle}>Linguagens</span>

            <div className={styles.langBar}>
                {languages.map((lang) => (
                    <span key={lang.name} style={{ width: `${lang.percent}%`, background: lang.color }} />
                ))}
            </div>

            <ul className={styles.langLegend}>
                {languages.map((lang) => (
                    <li key={lang.name}>
                        <i style={{ background: lang.color }} />
                        {lang.name} <small>{Math.round(lang.percent)}%</small>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LanguageBar