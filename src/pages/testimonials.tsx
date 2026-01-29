import { useEffect, useState } from "react"
import { PageTransition } from "../components/layout/page-transition"
import { Quote, Loader2 } from "lucide-react"
import { supabase } from "../lib/supabase"

export function Testimonials() {
    return (
        <PageTransition>
            <div className="pt-24 min-h-screen">
                <div className="container px-4 text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                        Client Stories
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Hear from the visionary leaders and companies we've had the privilege to work with.
                    </p>
                </div>
                <TestimonialsGrid />
            </div>
        </PageTransition>
    )
}

function TestimonialsGrid() {
    const [testimonials, setTestimonials] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function fetchTestimonials() {
        try {
            const { data } = await supabase
                .from("feedbacks")
                .select("*")
                .eq("approved", true)
                .order("created_at", { ascending: false })

            if (data) {
                setTestimonials(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center pb-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const displayTestimonials = testimonials.length > 0
        ? testimonials
        : [
            { id: 'p1', message: "Waiting for your feedback...", name: "Future Client", subject: "Company", image_url: null },
            { id: 'p2', message: "Join our list of happy clients.", name: "Your Name", subject: "CEO", image_url: null },
            { id: 'p3', message: "We'd love to hear from you.", name: "Partner", subject: "Director", image_url: null }
        ]

    return (
        <div className="container px-4 pb-20">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {displayTestimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black dark:border-white bg-card/50 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 lg:min-h-[350px]"
                    >
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-purple-500" />

                        <div>
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <Quote className="h-6 w-6 fill-current" />
                            </div>
                            <blockquote className="mb-6 text-lg font-medium leading-relaxed text-card-foreground">
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
                                <div className="font-bold text-base text-foreground">{testimonial.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {testimonial.company}
                                    {testimonial.company && testimonial.role && " - "}
                                    {testimonial.role}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
