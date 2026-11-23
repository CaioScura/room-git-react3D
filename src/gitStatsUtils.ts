// ---------- tipos ----------

export type ContributionDay = {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
}

export type GitHubRepo = {
    name: string
    html_url: string // NOVO: link do repositório
    language: string | null
    fork: boolean
    pushed_at: string
}

export type LanguageStat = {
    name: string
    percent: number
    color: string
}

// NOVO: o repositório mais recente
export type LatestRepo = {
    name: string
    url: string
    pushedAt: string
}

export type GitStatsData = {
    username: string
    publicRepos: number
    contributionsLastYear: number
    streakDays: number
    days: ContributionDay[]
    languages: LanguageStat[]
    latestRepo: LatestRepo | null // NOVO (null se não tiver nenhum repo)
}

// ---------- contas ----------

export function calcStreak(days: ContributionDay[]): number {
    let i = days.length - 1
    if (i >= 0 && days[i].count === 0) i--

    let streak = 0
    while (i >= 0 && days[i].count > 0) {
        streak++
        i--
    }
    return streak
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    PHP: '#4F5D95',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#663399',
    SCSS: '#c6538c',
    Blade: '#f7523f',
    Vue: '#41b883',
}

export function calcLanguages(repos: GitHubRepo[], max = 4): LanguageStat[] {
    const counts: Record<string, number> = {}

    for (const repo of repos) {
        if (repo.fork || !repo.language) continue
        counts[repo.language] = (counts[repo.language] ?? 0) + 1
    }

    const top = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, max)

    const total = top.reduce((sum, [, count]) => sum + count, 0)

    return top.map(([name, count]) => ({
        name,
        percent: (count / total) * 100,
        color: LANGUAGE_COLORS[name] ?? '#8b8cf5',
    }))
}

//o repositório (que não é fork) com o push mais recente
export function findLatestRepo(repos: GitHubRepo[]): LatestRepo | null {
    const own = repos.filter((repo) => !repo.fork)
    if (own.length === 0) return null

    // ordena do push mais novo para o mais antigo e pega o primeiro
    const latest = [...own].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0]
    return { name: latest.name, url: latest.html_url, pushedAt: latest.pushed_at }
}

export function timeAgo(isoDate: string): string {
    const minutes = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000)
    if (minutes < 60) return `há ${Math.max(minutes, 1)} min`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`

    const days = Math.floor(hours / 24)
    return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
}