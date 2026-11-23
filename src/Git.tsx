import { useEffect, useRef, useState } from 'react'
import styles from './Git.module.css'
import { Diorama, type ProjectId } from './diorama'
import { GIT_PROJECTS } from './gitProjects'
import { FiArrowUpRight, FiImage } from 'react-icons/fi'

import GitStats from './GitStats'
import { useGitStats } from './useGitStats' 

const Git = () => {
    const [selected, setSelected] = useState<ProjectId | null>(null)
    const [hovered, setHovered] = useState<ProjectId | null>(null)

    //stats do github
    const { stats, error } = useGitStats()

    const panelRef = useRef<HTMLDivElement>(null)
    const [fade, setFade] = useState({ top: false, bottom: false })


    // os dados do projeto clicado (ou null se nada estiver selecionado)
    const project = selected ? GIT_PROJECTS[selected] : null

    // os ids na ordem em que aparecem no gitProjects.ts
    const projectIds = Object.keys(GIT_PROJECTS) as ProjectId[]



    // mostra o degradê só na(s) borda(s) onde realmente tem mais conteúdo
    // escondido — some sozinho quando o conteúdo cabe inteiro ou quando o
    // scroll chega no fim/começo
    useEffect(() => {
        const el = panelRef.current
        if (!el) return

        const update = () => {
            setFade({
                top: el.scrollTop > 2,
                bottom: el.scrollHeight - el.scrollTop - el.clientHeight > 2,
            })
        }

        update()
        el.addEventListener('scroll', update, { passive: true })

        const resizeObserver = new ResizeObserver(update)
        resizeObserver.observe(el)

        return () => {
            el.removeEventListener('scroll', update)
            resizeObserver.disconnect()
        }
    })

    // ao abrir/fechar um projeto, volta a rolagem do painel para o topo
    useEffect(() => {
        panelRef.current?.scrollTo({ top: 0 })
    }, [selected])

    // Esc volta para a visão geral do quarto
    useEffect(() => {
        if (!selected) return // nada selecionado: não precisa ouvir o teclado

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null)
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [selected])

    return (
        <section className={styles.git} id="github">
            <div className={styles.inner}>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        GitHub<span className="cursor">_</span>
                    </h2>

                    <div
                        ref={panelRef}
                        className={`${styles.tabPanel} ${fade.top ? styles.fadeTop : ''} ${fade.bottom ? styles.fadeBottom : ''}`}
                    >

                            <>
                            {/* com um projeto aberto, esconde as stats para o detalhe aparecer logo no topo */}
                            {project ? null : stats ? (
                                <GitStats stats={stats} />
                            ) : (
                                !error && <p className={styles.text}>Carregando dados do GitHub...</p>
                            )}
                            
                            {project ? (
                                <>
                                <button type="button" className={styles.back} onClick={() => setSelected(null)}>
                                    ← voltar ao quarto
                                </button>
                                    <p className={styles.category}>{project.category}</p>
                                    <h3 className={styles.projectTitle}>
                                        {project.title}
                                        {project.note && <span className={styles.note}>{project.note}</span>}
                                    </h3>
                                    <p className={styles.text}>{project.description}</p>

                                    {/* vídeo quando tiver; senão a imagem; senão um espaço reservado */}
                                    <div className={styles.media}>
                                        {project.video ? (
                                            <video
                                                key={project.video} // troca de projeto = recarrega o vídeo
                                                src={project.video}
                                                poster={project.image}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                controls
                                            />
                                        ) : project.image ? (
                                            <img src={project.image} alt={project.title} />
                                        ) : (
                                            <div className={styles.mediaPlaceholder}>
                                                <FiImage />
                                                <span>Prévia em breve</span>
                                            </div>
                                        )}
                                    </div>

                                    <ul className={styles.stack}>
                                        {project.stack.map((tech) => (
                                            <li key={tech}>{tech}</li>
                                        ))}
                                    </ul>

                                    {/* um botão só: o projeto publicado, ou o repositório se não estiver no ar */}
                                    {(project.liveUrl ?? project.repoUrl) && (
                                        <a
                                            className={styles.liveLink}
                                            href={project.liveUrl ?? project.repoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Ver projeto <FiArrowUpRight />
                                        </a>
                                    )}
                                </>
                            ) : (
                            <>

                                <span className={styles.listTitle}>Projetos em destaque — clique aqui ou no quarto</span>

                                <ul className={styles.list}>
                                    {projectIds.map((id, index) => (
                                        <li key={id}>
                                            <button
                                                type="button"
                                                className={`${styles.item} ${hovered === id ? styles.itemActive : ''}`}
                                                onMouseEnter={() => setHovered(id)}
                                                onMouseLeave={() => setHovered(null)}
                                                onFocus={() => setHovered(id)}
                                                onBlur={() => setHovered(null)}
                                                onClick={() => {
                                                    setHovered(null)
                                                    setSelected(id)
                                                }}
                                            >
                                                <span className={styles.itemNum}>{String(index + 1).padStart(2, '0')}</span>
                                                <span className={styles.itemTitle}>
                                                    {GIT_PROJECTS[id].title}
                                                    {GIT_PROJECTS[id].featured && <span className={styles.badge}>Principal</span>}
                                                </span>
                                                <span className={styles.itemHint}>{GIT_PROJECTS[id].hint}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                            

                            </>
                    </div>
                </div>
                
                <div className={styles.stage}>
                    <Diorama
                            selected={selected}
                            onSelect={setSelected}
                            hovered={hovered}
                            onHover={setHovered}
                            />
                            <span className={styles.hint}>
                                {selected ? 'Esc ou clique fora para voltar' : 'Explore os objetos do quarto'}
                            </span>
                            <span className={styles.credit}>Feito com React Three Fiber + Three.js</span>

                </div>

                        
                        


                
            </div>
        </section>
    )
}

export default Git