import { motion } from "framer-motion"
import { Component, Database, Globe, Server, Smartphone, Terminal } from "lucide-react"

const technologies = [
    { icon: Globe, name: "React / Next.js", color: "text-blue-500" },
    { icon: Smartphone, name: "React Native", color: "text-cyan-500" },
    { icon: Database, name: "Supabase", color: "text-green-500" },
    { icon: Server, name: "Node.js", color: "text-emerald-500" },
    { icon: Terminal, name: "TypeScript", color: "text-blue-600" },
    { icon: Component, name: "Tailwind CSS", color: "text-sky-400" },
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
}

const floating = {
    animate: (i: number) => ({
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: i * 0.2, // Stagger the floating effect
        },
    }),
}

export function TechStack() {
    return (
        <section className="pt-0 pb-12">
            <div className="container px-4 text-center">
                <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl text-black dark:text-white">
                    Our <span className="text-primary">Tech Stack</span>
                </h2>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 pl-4"
                >
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="flex flex-col items-center justify-center gap-4 group"
                        >
                            <motion.div
                                custom={index}
                                variants={floating}
                                animate="animate"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 border border-border/50 transition-all duration-300 group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:shadow-lg ${tech.color}`}
                            >
                                <tech.icon className="h-10 w-10 transition-transform" />
                            </motion.div>
                            <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">{tech.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
