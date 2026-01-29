import { Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export function Footer() {
    return (
        <footer className="relative bg-black text-white overflow-hidden pt-20 pb-6">
            {/* Watermark */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                <h1 className="text-[15vw] font-bold leading-none text-white whitespace-nowrap -ml-10">
                    CODEHEX
                </h1>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    <div className="md:col-span-5">
                        <span className="text-3xl font-bold tracking-tight mb-6 inline-block">
                            CodeHex.
                        </span>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            We build digital experiences that propel businesses forward. Precision, creativity, and technical excellence in every line of code.
                        </p>
                        <div className="mt-8 flex gap-6">
                            <SocialLink icon={Twitter} href="#" />
                            <SocialLink icon={Github} href="#" />
                            <SocialLink icon={Linkedin} href="#" />
                        </div>
                    </div>

                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-6">Services</h3>
                            <ul className="space-y-4 text-gray-400">
                                <FooterLink to="/services">Web Development</FooterLink>
                                <FooterLink to="/services">Mobile Apps</FooterLink>
                                <FooterLink to="/services">Cloud Infrastructure</FooterLink>
                                <FooterLink to="/services">UI/UX Design</FooterLink>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-6">Company</h3>
                            <ul className="space-y-4 text-gray-400">
                                <FooterLink to="/about">About Us</FooterLink>
                                <FooterLink to="/about">Careers</FooterLink>
                                <FooterLink to="/blog">Blog</FooterLink>
                                <FooterLink to="/contact">Contact</FooterLink>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="font-semibold text-lg mb-6">Let's Talk</h3>
                            <p className="text-gray-400 mb-4">Have an idea?</p>
                            <Link to="/contact" className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                Start Project
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2025 Codehex. From your imagination to our implementation.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ icon: Icon, href }: { icon: any, href: string }) {
    return (
        <motion.a
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            href={href}
            className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-white transition-colors"
        >
            <Icon className="h-5 w-5" />
        </motion.a>
    )
}

function FooterLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <li>
            <Link to={to} className="hover:text-white hover:translate-x-1 transition-all inline-block w-full">
                {children}
            </Link>
        </li>
    )
}
