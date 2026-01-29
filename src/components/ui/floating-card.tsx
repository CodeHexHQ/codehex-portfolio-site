import { motion, useTransform, MotionValue } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

interface FloatingCardProps {
    children: ReactNode
    depth?: number
    className?: string
    mouseX: MotionValue<number>
    mouseY: MotionValue<number>
    initialRotate?: number
    initialX?: number
    initialY?: number
}

export function FloatingCard({
    children,
    depth = 1,
    className,
    mouseX,
    mouseY,
    initialRotate = 0,
    initialX = 0,
    initialY = 0
}: FloatingCardProps) {
    // Determine movement direction. 
    // depth > 0: moves opposite to mouse (background)
    // depth < 0: moves with mouse (foreground)
    // We want parallax background cards to move opposite: mouse moves right (positive), card moves left (negative).
    // So we map Input [0, 1] (or screen range) to Output [-move, move].

    // Using simple proportional transform with clamping for consistent speed
    const x = useTransform(mouseX, (val) => {
        // Val is relative mouse position in pixels from center
        // Clamp to prevent speed variations at edges
        const clampedVal = Math.max(-500, Math.min(500, val))
        return clampedVal * depth * -1 // Invert for parallax
    })

    const y = useTransform(mouseY, (val) => {
        const clampedVal = Math.max(-500, Math.min(500, val))
        return clampedVal * depth * -1
    })

    return (
        <motion.div
            style={{
                x,
                y,
                rotate: initialRotate,
                top: initialY ? `${initialY}%` : undefined,
                left: initialX ? `${initialX}%` : undefined,
            }}
            className={cn(
                "absolute rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-xl",
                "transition-all duration-500 ease-out",
                "hover:border-black/30 dark:hover:border-white/30 hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-2xl",
                "hover:shadow-primary/20",
                className
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            whileHover={{
                scale: 1.1,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                }
            }}
        >
            {children}
        </motion.div>
    )
}
