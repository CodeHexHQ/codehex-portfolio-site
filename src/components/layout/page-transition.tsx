import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { scaleFade } from "../../utils/animations"

interface PageTransitionProps {
    children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={scaleFade}
            className="relative w-full"
        >
            {children}
        </motion.div>
    )
}
