import { useEffect, useState } from 'react'
import { calcLanguages, calcStreak, findLatestRepo, type ContributionDay, type GitHubRepo, type GitStatsData } from './gitStatsUtils'

const USERNAME = 'CaioScura'

// só os campos que usamos de cada resposta
type GitHubUserResponse = { public_repos: number }
type ContributionsResponse = { contributions: ContributionDay[] }

// busca os dados do GitHub uma vez, quando a seção aparece
export function useGitStats() {
    const [stats, setStats] = useState<GitStatsData | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false // evita atualizar o estado se o componente sair antes da resposta chegar

        async function load() {
            try {
                // as 3 buscas ao mesmo tempo
                const [userRes, contribRes, reposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${USERNAME}`),
                    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`),
                    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`), // NOVO
                ])
                if (!userRes.ok || !contribRes.ok || !reposRes.ok) throw new Error('Falha ao buscar dados do GitHub')

                const user: GitHubUserResponse = await userRes.json()
                const contrib: ContributionsResponse = await contribRes.json()
                const repos: GitHubRepo[] = await reposRes.json() // NOVO

                // garante a ordem do mais antigo para o mais recente
                const days = [...contrib.contributions].sort((a, b) => a.date.localeCompare(b.date))

                if (cancelled) return
                setStats({
                    username: USERNAME,
                    publicRepos: user.public_repos,
                    contributionsLastYear: days.reduce((total, day) => total + day.count, 0),
                    streakDays: calcStreak(days),
                    days,
                    languages: calcLanguages(repos),
                    latestRepo: findLatestRepo(repos),
                })
            } catch (err) {
                console.error(err)
                if (!cancelled) setError(true)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    return { stats, error }
}