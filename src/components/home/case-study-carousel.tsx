import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { supabase } from "../../lib/supabase"

interface CardProps {
    title: string
    description: string
    image: string
    category: string
    color: string
    progress: MotionValue<number>
    range: number[]
    targetScale: number
    isLast: boolean
    link?: string
}

const Card = ({ title, description, image, category, color, progress, range, targetScale, isLast, link }: CardProps) => {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
    const scale = useTransform(progress, range, [1, targetScale])

    // Delay opacity fade: stay at 1 for first 50% of range, then fade to 0
    // If it's the last card, Opacity should stay at 1
    const rangeStart = range[0]
    const rangeEnd = range[1] || 1 // Fallback just in case
    const fadeStart = rangeStart + (rangeEnd - rangeStart) * 0.5

    const opacityTransform = useTransform(progress, [rangeStart, fadeStart, rangeEnd], [1, 1, 0])
    const opacity = isLast ? 1 : opacityTransform

    // For the last card, we want it to move UP to touch the title before scrolling away
    // Sequence: Title moves first (0.85-0.92), then Card follows (0.92-1.0)
    const yTransform = useTransform(progress, range, [0, 100])
    const lastCardY = useTransform(progress, [0.90, 1], [0, -172]) // Starts slightly overlapping with title end
    const y = isLast ? lastCardY : yTransform

    const handleRedirect = () => {
        if (link) {
            window.open(link, '_blank')
        }
    }

    return (
        <div ref={container} className="flex h-[80vh] items-center justify-center sticky top-20 sm:top-24 sm:h-screen">
            <motion.div
                style={{
                    scale,
                    backgroundColor: color,
                    // All cards stop at the same top position
                    top: `calc(-5vh + 10px)`,
                    opacity,
                    y
                }}
                className="absolute flex h-[60vh] min-h-[450px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-black dark:border-white p-4 shadow-2xl sm:h-[75vh] md:h-[80vh] max-h-[700px] md:flex-row md:p-12 origin-top"
            >
                <div className="flex flex-col justify-between md:w-[40%]">
                    <div>
                        <span className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 backdrop-blur-sm">
                            {category}
                        </span>
                        <h2 className="mb-4 mt-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">{title}</h2>
                        <p className="text-sm text-white/70 leading-relaxed sm:text-base md:text-lg">{description}</p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 group cursor-pointer" onClick={handleRedirect}>
                        <span className="text-sm font-medium text-white transition-colors group-hover:text-primary-foreground sm:text-base">Read Case Study</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all group-hover:bg-white group-hover:text-black">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="relative mt-6 h-full overflow-hidden rounded-2xl md:mt-0 md:w-[55%]">
                    <motion.div className="relative h-full w-full" style={{ scale: imageScale }}>
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export function CaseStudyCarousel() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    const titleY = useTransform(scrollYProgress, [0.80, 0.90], [0, -200])

    const [projects, setProjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('featured_work')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Transform data if needed, or map directly if field names match
                // We need to map db 'image_url' to 'image' and 'blog_post_url' to 'link' if we want to match CardProps exactly,
                // OR update Card to accept the new prop names.
                // Let's map it here to match existing Card component props for simplicity
                const mappedProjects = ((data as any[]) || []).map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.subject, // Mapping subject to description as requested
                    image: p.image_url,
                    category: p.category,
                    color: p.color || '#000000',
                    link: p.blog_post_url // Added to pass to card if we update card to use it
                }))

                setProjects(mappedProjects)
            } catch (err) {
                console.error("Failed to fetch projects:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <section className="bg-background pt-0 pb-0 -mb-40">
            <motion.div style={{ y: titleY }} className="sticky top-5 z-20 bg-background/95 backdrop-blur-xlpt-10 mb-20 ">
                <div className="container px-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-black dark:text-white">Featured <span className="text-primary">Work</span></h2>
                    <p className="mt-2 text-muted-foreground">See how we transform ideas into reality. Scroll to explore.</p>
                </div>
            </motion.div>

            <div ref={container} className="px-4 w-full">
                {isLoading ? (
                    <div className="py-20 text-center">Loading Featured Work...</div>
                ) : projects.length === 0 ? (
                    <div className="py-20 text-center">No featured work found.</div>
                ) : (
                    projects.map((project, i) => {
                        // Standardize target scale - all cards scale down to same size when leaving
                        const targetScale = 0.9
                        return (
                            <Card
                                key={project.id}
                                {...project}
                                progress={scrollYProgress}
                                range={[i * 0.25, 1]}
                                targetScale={targetScale}
                                isLast={i === projects.length - 1}
                            />
                        )
                    })
                )}
            </div>
        </section>
    )
}
