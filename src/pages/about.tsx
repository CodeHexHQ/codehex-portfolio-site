
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Loader2 } from "lucide-react"
import { supabase } from "../lib/supabase"
import type { Database } from "../types/database"

type TeamMember = Database['public']['Tables']['team_members']['Row']

export function About() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const { data } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: true })

                if (data) setTeamMembers(data)
            } catch (error) {
                console.error('Error fetching team members:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTeam()
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Mission / Hero Section */}
            <section className="pt-24 pb-20 relative">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="container px-4 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
                            We Build The <span className="text-primary">Extraordinary</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
                            CodeHex is a premium digital agency tailored for forward-thinking brands.
                            We combine cutting-edge technology with immersive design to create digital
                            experiences that captivate and convert.
                        </p>
                    </motion.div>


                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-medium tracking-widest uppercase text-sm">The Minds Behind CodeHex</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-4">Meet Our Team</h2>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative bg-card border border-border/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
                            >
                                {/* Image with overlay effect */}
                                <div className="relative h-80 overflow-hidden">
                                    <motion.img
                                        src={member.image_url}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />

                                    {/* Floating Socials */}
                                    <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {member.linkedin_url && (
                                            <a href={member.linkedin_url} className="p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.twitter_url && (
                                            <a href={member.twitter_url} className="p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.github_url && (
                                            <a href={member.github_url} className="p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6 relative">
                                    <div className="absolute top-0 right-6 -translate-y-1/2 w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                        <span className="text-xl font-bold text-primary-foreground">
                                            {member.name.split(" ")[0][0]}{member.name.split(" ")[1] ? member.name.split(" ")[1][0] : ""}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-primary font-medium mb-4">{member.role}</p>
                                    <p className="text-muted-foreground leading-relaxed line-clamp-4">
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
