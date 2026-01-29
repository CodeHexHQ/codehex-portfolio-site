import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CursorFollower() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)
    
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)
    
    const springConfig = { damping: 25, stiffness: 350, mass: 0.5 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        // Only show on desktop devices
        const checkDevice = () => {
            setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
        }
        checkDevice()
        window.addEventListener('resize', checkDevice)
        return () => window.removeEventListener('resize', checkDevice)
    }, [])

    useEffect(() => {
        const updateCursorPosition = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            setIsVisible(true)
        }

        const handleMouseEnter = () => setIsHovering(true)
        const handleMouseLeave = () => setIsHovering(false)

        // Track interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter)
            el.addEventListener('mouseleave', handleMouseLeave)
        })

        window.addEventListener('mousemove', updateCursorPosition)
        window.addEventListener('mouseenter', () => setIsVisible(true))
        window.addEventListener('mouseleave', () => setIsVisible(false))

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition)
            window.removeEventListener('mouseenter', () => setIsVisible(true))
            window.removeEventListener('mouseleave', () => setIsVisible(false))
            
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter)
                el.removeEventListener('mouseleave', handleMouseLeave)
            })
        }
    }, [cursorX, cursorY])

    if (!isVisible || !isDesktop) return null

    return (
        <>
            {/* Outer ring with hexagon pattern */}
            <motion.div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    left: -24,
                    top: -24,
                }}
            >
                <motion.div
                    className="relative w-12 h-12"
                    animate={{
                        rotate: isHovering ? 180 : 0,
                        scale: isHovering ? 1.2 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                >
                    {/* Hexagon shape */}
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 40 40"
                        className="absolute inset-0"
                    >
                        <motion.polygon
                            points="20,5 32,12 32,28 20,35 8,28 8,12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-primary"
                            animate={{
                                pathLength: isHovering ? 1 : 0.8,
                                opacity: isHovering ? 1 : 0.85,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Inner dot with gradient */}
            <motion.div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    left: -4,
                    top: -4,
                }}
            >
                <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-primary via-primary to-primary/90 shadow-lg"
                    animate={{
                        scale: isHovering ? 1.5 : 1,
                        opacity: isHovering ? 1 : 0.9,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                    }}
                />
            </motion.div>

            {/* Glow effect */}
            <motion.div
                className="fixed pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    left: -50,
                    top: -50,
                }}
            >
                <motion.div
                    className="w-[100px] h-[100px] rounded-full bg-primary/50 blur-3xl"
                    animate={{
                        scale: isHovering ? 1.6 : 1.3,
                        opacity: isHovering ? 0.8 : 0.5,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                    }}
                />
            </motion.div>
        </>
    )
}

