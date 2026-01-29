import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "../common/mode-toggle"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const location = useLocation()
    const lastScrollYRef = useRef<number>(0)
    const heroHeightRef = useRef<number>(0)

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    // Scroll detection for hide/show navbar
    useEffect(() => {
        // Get hero section height (viewport height)
        heroHeightRef.current = window.innerHeight

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const heroHeight = heroHeightRef.current
            const lastScrollY = lastScrollYRef.current

            // Only hide navbar after hero section
            if (currentScrollY > heroHeight) {
                // Scrolling down - hide navbar
                if (currentScrollY > lastScrollY && currentScrollY > heroHeight + 50) {
                    setIsVisible(false)
                }
                // Scrolling up - show navbar
                else if (currentScrollY < lastScrollY) {
                    setIsVisible(true)
                }
            } else {
                // Always show navbar in hero section
                setIsVisible(true)
            }

            lastScrollYRef.current = currentScrollY
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { href: "/services", label: "Services" },
        { href: "/case-studies", label: "Case Studies" },
        { href: "/testimonials", label: "Testimonials" },
        { href: "/blog", label: "Blog" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <motion.header 
            className="sticky top-0 z-[50] w-full flex justify-center pt-4 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            initial={{ y: 0, opacity: 1 }}
            animate={{ 
                y: isVisible ? 0 : -100,
                opacity: isVisible ? 1 : 0
            }}
            transition={{ 
                duration: 0.3,
                ease: "easeInOut"
            }}
        >
            <div className="w-full max-w-4xl mx-auto border border-border/80 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-2xl px-6 sm:px-8 shadow-sm">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link className="flex items-center space-x-2 group" to="/">
                            <span className="font-bold inline-block text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                                CodeHex
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav - Right Side */}
                    <div className="hidden lg:flex items-center gap-1">
                        <nav className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                                        location.pathname === link.href
                                            ? "text-foreground"
                                            : "text-foreground/70 hover:text-foreground"
                                    } hover:bg-accent/50`}
                                >
                                    {link.label}
                                    {location.pathname === link.href && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                            layoutId="navbar-indicator"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>
                        <div className="h-6 w-px bg-border/50 mx-2" />
                        <div className="flex items-center">
                            <ModeToggle />
                        </div>
                    </div>
                    
                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <ModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/70 hover:bg-accent hover:text-foreground focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-x-0 top-20 z-50 overflow-hidden bg-background border-t border-border/40 lg:hidden"
                    >
                        <div className="container h-full px-4 py-8 flex flex-col items-center space-y-8">
                            <nav className="flex flex-col items-center space-y-6 text-lg font-medium">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link
                                            to={link.href}
                                            className={`block py-2 transition-colors hover:text-primary ${location.pathname === link.href
                                                    ? "text-primary font-bold"
                                                    : "text-foreground/80"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-auto pb-20"
                            >
                                <Link
                                    to="/contact"
                                    className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
