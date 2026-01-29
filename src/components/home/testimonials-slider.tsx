import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { supabase } from "../../lib/supabase"

export function TestimonialsSlider() {
    const [testimonials, setTestimonials] = useState<any[]>([])
    const [startIndex, setStartIndex] = useState(0)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function fetchTestimonials() {
        const { data } = await supabase
            .from("feedbacks")
            .select("*")
            .eq("approved", true)
            .order("created_at", { ascending: false })

        if (data && data.length > 0) {
            setTestimonials(data)
        }
    }

    const nextSlide = () => {
        setStartIndex((prev) => (prev + 3 >= testimonials.length ? 0 : prev + 3))
    }

    const prevSlide = () => {
        setStartIndex((prev) => (prev - 3 < 0 ? Math.max(0, testimonials.length - 3) : prev - 3))
    }

    const visibleTestimonials = testimonials.length > 0
        ? testimonials.slice(startIndex, startIndex + 3)
        : [
            { id: 'p1', message: "Waiting for your feedback...", name: "Future Client", subject: "Company", image_url: null, gradient: "from-gray-500 to-gray-600" },
            { id: 'p2', message: "Join our list of happy clients.", name: "Your Name", subject: "CEO", image_url: null, gradient: "from-gray-500 to-gray-600" },
            { id: 'p3', message: "We'd love to hear from you.", name: "Partner", subject: "Director", image_url: null, gradient: "from-gray-500 to-gray-600" }
        ]

    // if (testimonials.length === 0) return null // Removed to show placeholders

    return (
        <section className="bg-background pt-0 pb-12 relative overflow-hidden z-10">
            <div className="container px-4 text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-black dark:text-white"
                >
                    Client <span className="text-primary">Testimonials</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-muted-foreground text-lg"
                >
                    See what industry leaders are saying about us.
                </motion.p>
            </div>

            <div className="container px-4 max-w-6xl mx-auto">
                <div className="relative">
                    {/* Navigation Buttons */}
                    {testimonials.length > 3 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 hidden lg:flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
                                aria-label="Previous testimonials"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 hidden lg:flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
                                aria-label="Next testimonials"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {visibleTestimonials.map((testimonial, idx) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black dark:border-white bg-card/50 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 lg:min-h-[400px]"
                                >
                                    {/* Gradient Border Line */}
                                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-purple-500" />

                                    <div>
                                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                            <Quote className="h-6 w-6 fill-current" />
                                        </div>

                                        <blockquote className="mb-8 text-lg font-medium leading-relaxed text-card-foreground">
                                            "{testimonial.message}"
                                        </blockquote>
                                    </div>

                                    <div className="flex items-center gap-4 mt-auto">
                                        {testimonial.image_url ? (
                                            <img
                                                src={testimonial.image_url}
                                                alt={testimonial.name}
                                                className="h-12 w-12 rounded-full object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg shadow-md">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <div className="font-bold text-lg text-foreground">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {testimonial.company}
                                                {testimonial.company && testimonial.role && " - "}
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Navigation (Dots) */}
                    {testimonials.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2 lg:hidden">
                            <button onClick={prevSlide} className="p-2 rounded-full bg-muted">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button onClick={nextSlide} className="p-2 rounded-full bg-muted">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
