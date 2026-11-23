import type { ProjectId } from './diorama'

// imagens dos projetos
import imgPomomates from './assets/projetos/images/img-pomomates.png'
import imgTravel from './assets/projetos/images/img-ai-travel-planner.png'
import imgExpression from './assets/projetos/images/img-expression-lab.png'
import imgGatos from './assets/projetos/images/img-extensao-gatos.png'
import imgSpotify from './assets/projetos/images/img-prj-api-spotify.png'
import imgSpring from './assets/projetos/images/img-api-rest-spring.png'

// vídeos de demonstração (só são baixados quando o projeto é aberto)
import vidExpression from './assets/projetos/videos/video-expression-lab.mp4'
import vidGatos from './assets/projetos/videos/prj-gatos-flutuantes.mp4'
import vidSpotify from './assets/projetos/videos/video-mood-layer-spotify.mp4'

// informações que o painel mostra de cada projeto
type GitProject = {
    category: string // ex.: "Front-end", aparece acima do título
    title: string
    description: string
    stack: string[]
    image?: string // mostrada quando não tem vídeo (e como capa enquanto o vídeo carrega)
    video?: string
    liveUrl?: string // projeto publicado
    repoUrl?: string // "?" = opcional: nem todo projeto tem repositório público
    note?: string // observação curta, ex.: "Em desenvolvimento"
    hint: string // onde o projeto aparece no quarto
    featured?: boolean // projeto principal (ganha a etiqueta "PRINCIPAL")
}

// um projeto para cada id do quarto
export const GIT_PROJECTS: Record<ProjectId, GitProject> = {
    pomomates: {
        category: 'Mobile',
        title: 'Pomomates',
        description: 'O Pomomates é um app que atua como um temporizador de foco, com ênfase em tempo de estudo, ajudando a evitar desvios de atenção durante tarefas atuando como um temporizador pomodoro.',
        stack: ['Angular', 'Ionic', 'TypeScript', 'SCSS', 'Capacitor', 'NestJS', 'PostgreSQL + Prisma', 'Supabase', 'Docker'],
        image: imgPomomates,
        note: 'Em desenvolvimento! Trabalho em conjunto',
        hint: 'Tomate-timer + monitor',
        featured: true,
    },
    travel: {
        category: 'Front-end',
        title: 'TripMind',
        description: 'Plataforma de planejamento de viagens com IA, projetada para criar roteiros personalizados com base nas preferências dos usuários, com foco em uma experiência interativa e intuitiva.',
        stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'OpenAI API', 'Maps API'],
        image: imgTravel,
        repoUrl: 'https://github.com/CaioScura/AI-travel-planner',
        note: 'Em desenvolvimento',
        hint: 'Mapa na parede',
    },
    expression: {
        category: 'Python',
        title: 'Expression Lab',
        description: 'Aplicação de visão computacional que utiliza a webcam para detectar gestos com as mãos e expressões faciais em tempo real. O projeto busca reconhecer gestos personalizados e associá-los a imagens e GIFs, explorando o processamento de imagens e a detecção de características faciais e manuais.',
        stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy'],
        image: imgExpression,
        video: vidExpression,
        repoUrl: 'https://github.com/CaioScura/expression-lab',
        hint: 'Webcam',
    },
    gatos: {
        category: 'Front-end',
        title: 'Extensão Gatos Flutuantes',
        description: 'Extensão para navegador que adiciona gatinhos animados em qualquer página da web. Possui diversas animações que eu mesmo criei utilizando software de pixel art, você pode mover os gatos e deixar em qualquer canto da tela.',
        stack: ['JavaScript', 'HTML', 'CSS', 'Manifest V3'],
        image: imgGatos,
        video: vidGatos,
        liveUrl: 'https://chromewebstore.google.com/detail/cmobdigkhadnfgbfahchpjlbdpeeafec',
        note: 'Disponível para download!',
        hint: 'Gato na prateleira',
    },
    mood: {
        category: 'Full Stack',
        title: 'Mood Player Spotify',
        description: 'Mood Player que recomenda e reproduz músicas curtidas do Spotify de acordo com o humor escolhido. O projeto foi desenvolvido para explorar o consumo da API do Spotify, autenticação e configuração da aplicação, além de práticas de deploy com Docker e Render.',
        stack: ['Bootstrap', 'CSS', 'JavaScript', 'Laravel', 'OAuth 2.0', 'Spotify Web API'],
        image: imgSpotify,
        video: vidSpotify,
        repoUrl: 'https://github.com/CaioScura/API_Spotify',
        hint: 'Toca-discos',
    },
    springapi: {
        category: 'Back-end',
        title: 'API REST em Java',
        description: 'API REST desenvolvida com Spring Boot para gerenciamento de médicos e pacientes de uma clínica médica, criada na trilha Java e Spring Boot da Alura.',
        stack: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Auth0 JWT', 'MySQL'],
        image: imgSpring,
        repoUrl: 'https://github.com/CaioScura/API-REST-springboot',
        hint: 'Caneca de café',
    },
    jornada: {
        category: 'Front-end',
        title: 'Jornada Milhas',
        description: 'Site de busca de passagens aéreas, desenvolvido em Angular com Angular Material.',
        stack: ['Angular', 'TypeScript', 'Angular Material'],
        repoUrl: 'https://github.com/CaioScura/jornada-milhas',
        hint: 'Aviãozinho',
    },
    vila: {
        category: 'Cloud',
        title: 'Vila Nuvem',
        description: 'Vila 3D em que cada serviço da AWS vira um prédio, para aprender cloud de forma visual.',
        stack: ['Three.js', 'TypeScript', 'AWS'],
        note: 'Em desenvolvimento',
        hint: 'Miniatura na prateleira',
    },
}
