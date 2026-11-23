import type { ProjectId } from './diorama'

// informações que o painel mostra de cada projeto
type GitProject = {
    title: string
    description: string
    stack: string[]
    repoUrl?: string // "?" = opcional: nem todo projeto tem repositório público
    hint: string // onde o projeto aparece no quarto
    featured?: boolean // projeto principal (ganha a etiqueta "PRINCIPAL")
}

// um projeto para cada id do quarto
export const GIT_PROJECTS: Record<ProjectId, GitProject> = {
    pomomates: {
        title: 'Pomomates',
        description: 'App de foco com temporizador pomodoro, ajudando a evitar desvios de atenção durante os estudos.',
        stack: ['Angular', 'Ionic', 'TypeScript', 'NestJS', 'Supabase'],
        hint: 'Tomate-timer + monitor',
        featured: true,
    },
    travel: {
        title: 'TripMind',
        description: 'Plataforma de planejamento de viagens com IA, que cria roteiros personalizados com base nas preferências do usuário.',
        stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'OpenAI API'],
        repoUrl: 'https://github.com/CaioScura/AI-travel-planner',
        hint: 'Mapa na parede',
    },
    expression: {
        title: 'Expression Lab',
        description: 'Visão computacional pela webcam para detectar gestos com as mãos e expressões faciais em tempo real.',
        stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy'],
        repoUrl: 'https://github.com/CaioScura/expression-lab',
        hint: 'Webcam',
    },
    gatos: {
        title: 'Gatos Flutuantes',
        description: 'Extensão de navegador que adiciona gatinhos animados em pixel art a qualquer página da web.',
        stack: ['JavaScript', 'HTML', 'CSS', 'Manifest V3'],
        hint: 'Gato na prateleira',
    },
    mood: {
        title: 'Mood Player Spotify',
        description: 'Recomenda e toca músicas curtidas do Spotify de acordo com o humor escolhido.',
        stack: ['Laravel', 'JavaScript', 'OAuth 2.0', 'Spotify Web API'],
        repoUrl: 'https://github.com/CaioScura/API_Spotify',
        hint: 'Toca-discos',
    },
    springapi: {
        title: 'API REST em Java',
        description: 'API REST com Spring Boot para gerenciar médicos e pacientes de uma clínica.',
        stack: ['Java', 'Spring Boot', 'Spring Security', 'MySQL'],
        repoUrl: 'https://github.com/CaioScura/API-REST-springboot',
        hint: 'Caneca de café',
    },
    jornada: {
        title: 'Jornada Milhas',
        description: 'Site de busca de passagens aéreas, desenvolvido em Angular com Angular Material.',
        stack: ['Angular', 'TypeScript', 'Angular Material'],
        repoUrl: 'https://github.com/CaioScura/jornada-milhas',
        hint: 'Aviãozinho',
    },
    vila: {
        title: 'Vila Nuvem',
        description: 'Vila 3D em que cada serviço da AWS vira um prédio, para aprender cloud de forma visual.',
        stack: ['Three.js', 'TypeScript', 'AWS'],
        hint: 'Miniatura na prateleira',
    },
}