import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export function CaseStudies() {
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

                const mappedProjects = ((data as any[]) || []).map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.subject, // Mapping subject to description
                    image: p.image_url,
                    category: p.category,
                    link: p.blog_post_url
                }))

                setProjects(mappedProjects)
            } catch (err) {
                console.error("Failed to fetch case studies:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            {/* Hero Section */}
            <section className="container px-4 mx-auto mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                        Our Portfolio
                    </span>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-black dark:text-white">
                        Featured <span className="text-primary">Case Studies</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
                        Explore how we've helped businesses transform their digital presence and achieve measurable growth through innovative technology solutions.
                    </p>
                </motion.div>
            </section>

            {/* Case Studies Grid */}
            <section className="container px-4 mx-auto">
                {isLoading ? (
                    <div className="py-20 text-center">Loading Case Studies...</div>
                ) : projects.length === 0 ? (
                    <div className="py-20 text-center">No case studies found.</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                        {projects.map((study, index) => (
                            <motion.div
                                key={study.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-black dark:border-border/50 border-[3px] dark:border bg-black dark:bg-card text-white dark:text-foreground hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden sm:h-80">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                                    <motion.img
                                        src={study.image}
                                        alt={study.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-white transition-transform duration-300 group-hover:rotate-45">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-6 md:p-8 relative z-20 -mt-12">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-primary/80 backdrop-blur-sm rounded-full">
                                            {study.category}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold group-hover:text-primary transition-colors">
                                        {study.title}
                                    </h3>
                                    <p className="text-white/70 dark:text-muted-foreground leading-relaxed flex-1">
                                        {study.description}
                                    </p>

                                    <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between cursor-pointer"
                                        onClick={() => {
                                            if (study.link) {
                                                window.open(study.link, '_blank');
                                            }
                                        }}>
                                        <span className="text-sm font-medium text-white/70 dark:text-muted-foreground group-hover:text-primary transition-colors">Read full story</span>
                                        <ArrowUpRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
