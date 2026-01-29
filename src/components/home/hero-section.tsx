import { useEffect, useRef, useState } from "react"
import { supabase } from "../../lib/supabase"
import { cn } from "../../lib/utils"
import { Link } from "react-router-dom"
import { motion, useMotionValue } from "framer-motion"
import { FloatingCard } from "../ui/floating-card"
import { ArrowRight, Code2, Database, Layout, Sparkles, Terminal, Globe, Shield, GitBranch, Cloud, Blocks, Package, Server, Workflow } from "lucide-react"

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Project Availability State
    const [isAvailable, setIsAvailable] = useState(true)

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'project_availability')
                    .single()

                if (data && (data as any).value) {
                    setIsAvailable((data as any).value.is_available)
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err)
            }
        }
        fetchSettings()
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const x = clientX - innerWidth / 2
        const y = clientY - innerHeight / 2
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e.touches[0]
        const { innerWidth, innerHeight } = window
        // Increase sensitivity on mobile by multiplying the offset
        const x = (clientX - innerWidth / 2) * 2.5
        const y = (clientY - innerHeight / 2) * 2.5
        mouseX.set(x)
        mouseY.set(y)
    }

    // Mobile Gyro Effect
    const initialBeta = useRef<number | null>(null)
    const initialGamma = useRef<number | null>(null)

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            const { beta, gamma } = event
            if (beta === null || gamma === null) return

            // Set initial reference point on first valid reading
            if (initialBeta.current === null) {
                initialBeta.current = beta
                initialGamma.current = gamma
                return
            }

            const { innerWidth, innerHeight } = window

            // Calculate deviation from initial position
            // gamma: left-right tilt
            // beta: front-back tilt

            const deltaGamma = gamma - (initialGamma.current || 0)
            const deltaBeta = beta - (initialBeta.current || 0)

            // Clamp max rotation to avoid extreme shifts if user spins around
            // but allow enough range for the effect

            // Map tilt to coordinate offsets
            const x = deltaGamma * 5 * (innerWidth / 100)
            const y = deltaBeta * 5 * (innerHeight / 100)

            mouseX.set(x)
            mouseY.set(y)
        }

        // Request permission for iOS 13+ devices
        const requestPermission = async () => {
            if (
                typeof DeviceOrientationEvent !== 'undefined' &&
                typeof (DeviceOrientationEvent as any).requestPermission === 'function'
            ) {
                try {
                    const permissionState = await (DeviceOrientationEvent as any).requestPermission()
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation)
                    }
                } catch (error) {
                    console.error("Gyro permission denied:", error)
                }
            } else {
                // Non-iOS 13+ devices
                window.addEventListener('deviceorientation', handleOrientation)
            }
        }

        requestPermission()

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }, [])

    // 16 Cards Configuration - Uniform Grid Distribution with Varied Sizes
    // Fixed spacing: 4 columns x 4 rows covering entire panoramic area
    // Column spacing: ~60% intervals | Row spacing: ~28% intervals
    // Sizes: 'sm' = 4x4cm (w-40 h-40), 'md' = 6x6cm (w-60 h-60), 'lg' = 8x8cm (w-80 h-80)
    const cards = [
        // === ROW 1 (Top - y: 8%) ===
        { icon: Terminal, label: "Bash", x: 10, y: -5, rot: -3, color: "bg-orange-500/10 text-orange-400", size: "md", className: "flex" },
        { icon: Code2, label: "React", x: -25, y: -42, rot: 2, color: "bg-blue-500/10 text-blue-400", size: "lg", className: "flex" },
        { icon: Database, label: "SQL", x: -20, y: 25, rot: -2, color: "bg-emerald-500/10 text-emerald-400", size: "sm", className: "flex" },
        { icon: Sparkles, label: "AI", x: 115, y: -40, rot: 3, color: "bg-purple-500/10 text-purple-400", size: "md", className: "flex" },

        // === ROW 2 (Upper-Middle - y: 36%) ===
        { icon: Layout, label: "UI/UX", x: -34, y: 118, rot: 2, color: "bg-pink-500/10 text-pink-400", size: "sm", className: "flex" },
        { icon: Package, label: "NPM", x: -25, y: 75, rot: -3, color: "bg-red-600/10 text-red-500", size: "lg", className: "flex" },
        { icon: Globe, label: "Web", x: 50, y: -30, rot: 3, color: "bg-cyan-500/10 text-cyan-400", size: "md", className: "flex" },
        { icon: Shield, label: "Sec", x: 100, y: 20, rot: -2, color: "bg-red-500/10 text-red-400", size: "sm", className: "flex" },

        // === ROW 3 (Lower-Middle - y: 64%) ===
        // { icon: Cpu, label: "API", x: -60, y: 64, rot: -3, color: "bg-indigo-500/10 text-indigo-400", size: "lg" },
        { icon: Server, label: "Server", x: 120, y: 50, rot: 4, color: "bg-green-600/10 text-green-500", size: "sm", className: "flex" },
        { icon: Workflow, label: "Flow", x: 50, y: 64, rot: -2, color: "bg-violet-500/10 text-violet-400", size: "md", className: "flex" },
        // { icon: Zap, label: "Fast", x: 160, y: 64, rot: 3, color: "bg-yellow-500/10 text-yellow-400", size: "sm" },

        // === ROW 4 (Bottom - y: 92%) ===
        { icon: GitBranch, label: "Git", x: 65, y: 110, rot: -4, color: "bg-orange-600/10 text-orange-500", size: "sm", className: "flex" },
        { icon: Cloud, label: "Cloud", x: 25, y: 110, rot: 2, color: "bg-sky-500/10 text-sky-400", size: "md", className: "flex" },
        { icon: Blocks, label: "Docker", x: 110, y: 100, rot: -3, color: "bg-blue-600/10 text-blue-500", size: "lg", className: "flex" },
        // { icon: Settings, label: "DevOps", x: 160, y: 92, rot: 4, color: "bg-slate-500/10 text-slate-400", size: "md" }
    ]

    return (
        <div
            ref={containerRef}
            className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* Background Gradient/Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

            {/* Parallax Floating Cards Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {cards.map((card, i) => {
                    // Define size classes based on card size
                    const sizeClasses = {
                        sm: 'w-16 h-16 p-2 gap-1 md:w-32 md:h-32 md:p-5 md:gap-3',
                        md: 'w-20 h-20 p-3 gap-1 md:w-48 md:h-48 md:p-7 md:gap-4',
                        lg: 'w-24 h-24 p-4 gap-2 md:w-64 md:h-64 md:p-9 md:gap-5'
                    }
                    const iconSizes = {
                        sm: 'w-6 h-6 md:w-10 md:h-10',
                        md: 'w-8 h-8 md:w-14 md:h-14',
                        lg: 'w-10 h-10 md:w-16 md:h-16'
                    }
                    const textSizes = {
                        sm: 'text-[0.5rem] md:text-xs',
                        md: 'text-[0.6rem] md:text-sm',
                        lg: 'text-[0.7rem] md:text-base'
                    }

                    return (
                        <FloatingCard
                            key={i}
                            mouseX={mouseX}
                            mouseY={mouseY}
                            depth={1.2}
                            initialX={card.x}
                            initialY={card.y}
                            initialRotate={card.rot}
                            className={`z-10 ${sizeClasses[card.size as keyof typeof sizeClasses]} flex flex-col items-center justify-center pointer-events-auto ${card.color} ${card.className || ""}`}
                        >
                            <card.icon className={`${iconSizes[card.size as keyof typeof iconSizes]} opacity-80`} />
                            <span className={`${textSizes[card.size as keyof typeof textSizes]} font-bold opacity-70 uppercase tracking-wider`}>{card.label}</span>
                        </FloatingCard>
                    )
                })}
            </div>

            {/* Main Content (Center) */}
            <div className="relative z-20 container px-4 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative flex flex-col items-center"
                >
                    <div className="mb-4 flex justify-center">
                        <div className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur-md transition-colors",
                            isAvailable
                                ? "border-green-500/20 bg-green-500/10 text-green-500"
                                : "border-red-500/20 bg-red-500/10 text-red-500"
                        )}>
                            <span className={cn(
                                "relative flex h-2 w-2",
                                isAvailable ? "animate-pulse" : ""
                            )}>
                                <span className={cn(
                                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                                    isAvailable ? "animate-ping bg-green-500" : "bg-red-500"
                                )}></span>
                                <span className={cn(
                                    "relative inline-flex h-2 w-2 rounded-full",
                                    isAvailable ? "bg-green-500" : "bg-red-500"
                                )}></span>
                            </span>
                            {isAvailable ? "Available for new projects" : "Fully booked at the moment"}
                        </div>
                    </div>

                    <motion.h1 
                        className="relative text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] flex items-center justify-center"
                        initial="initial"
                        animate="animate"
                    >
                        {"CODEHEX".split("").map((letter, index) => {
                            const isHexPart = index >= 4; // H, E, X are the HEX part
                            return (
                                <motion.span
                                    key={index}
                                    className={`inline-block ${
                                        isHexPart 
                                            ? "text-blue-600 dark:text-blue-500" 
                                            : "text-black dark:text-white"
                                    }`}
                                    variants={{
                                        initial: { 
                                            y: 0,
                                            scale: 1,
                                            rotate: 0,
                                            opacity: 0
                                        },
                                        animate: {
                                            y: 0,
                                            scale: 1,
                                            rotate: 0,
                                            opacity: 1,
                                            transition: {
                                                delay: index * 0.1,
                                                duration: 0.5,
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }
                                        }
                                    }}
                                    whileHover={{
                                        y: -12,
                                        scale: 1.2,
                                        rotate: 5,
                                        transition: {
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 15
                                        }
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            );
                        })}
                    </motion.h1>

                    <p className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light">
                        Turning complex problems into elegant
                        <span className="mx-2 font-medium text-foreground">Digital Reality</span>
                    </p>

                    <div className="mt-10 flex gap-4">
                        <Link to="/contact">
                            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all hover:bg-primary/90 min-w-[140px]">
                                <span className="mr-2 whitespace-nowrap">Start Project</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                        <Link to="/case-studies">
                            <button className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                                View Work
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
