import { useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../lib/supabase"
import { Loader2, Send, Mail, Phone, Upload, X } from "lucide-react"

interface ContactFormProps {
    embedded?: boolean
    serviceTitle?: string
}

export function ContactForm({ embedded = false, serviceTitle }: ContactFormProps) {
    const [formMode, setFormMode] = useState<"project" | "feedback">("project")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        business_description: "",
        requirements: serviceTitle ? `I'm interested in ${serviceTitle} services.` : "",
        // Feedback specific fields
        company: "",
        role: "",
        message: ""
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const clearFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('testimonial-images')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('testimonial-images')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus("idle")

        try {
            if (formMode === "project") {
                const { error } = await supabase
                    .from("leads")
                    .insert([{
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone || null,
                        business_description: formData.business_description || null,
                        requirements: formData.requirements || null,
                        status: 'new'
                    }] as any)
                if (error) throw error
            } else {
                let imageUrl = null
                if (selectedFile) {
                    imageUrl = await uploadImage(selectedFile)
                }

                const { error } = await supabase
                    .from("feedbacks")
                    .insert([{
                        name: formData.name,
                        email: formData.email,
                        company: formData.company || null,
                        role: formData.role || null,
                        image_url: imageUrl,
                        message: formData.message,
                        status: 'unread',
                        approved: false
                    }] as any)
                if (error) throw error
            }

            setStatus("success")
            setFormData({
                name: "",
                email: "",
                phone: "",
                business_description: "",
                requirements: "",
                company: "",
                role: "",
                message: ""
            })
            clearFile()
        } catch (error) {
            console.error(error)
            setStatus("error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const content = (
        <div className={embedded ? "w-full" : "container px-4 max-w-3xl mx-auto"}>
            {!embedded && (
                <div className="text-center mb-16">
                    <motion.h2
                        key={formMode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
                    >
                        {formMode === "project" ? "Start Your Project" : "We Value Your Feedback"}
                    </motion.h2>
                    <motion.p
                        key={`${formMode}-desc`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-muted-foreground text-lg"
                    >
                        {formMode === "project"
                            ? "Ready to transform your ideas into reality? Let's build something amazing together."
                            : "Help us improve or just say hello. We read every message."}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12"
                    >
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="w-5 h-5 text-primary" />
                            <span>codehex.team@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="w-5 h-5 text-primary" />
                            <span>+91 7991161984</span>
                        </div>
                    </motion.div>
                </div>
            )}

            {embedded && (
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Interested in {serviceTitle}?</h3>
                    <p className="text-muted-foreground">
                        Get a quote or schedule a consultation specifically for this service.
                    </p>
                </div>
            )}

            <motion.div
                initial={embedded ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={embedded ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`bg-card border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden ${embedded ? "shadow-none border-0 bg-transparent p-0" : ""}`}
            >
                {!embedded && (
                    <>
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    </>
                )}

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8 relative z-10">
                    <div className="bg-muted/50 p-1 rounded-full flex relative">
                        {/* Sliding background pill */}
                        <motion.div
                            className="absolute top-1 bottom-1 bg-background rounded-full shadow-sm z-0"
                            initial={false}
                            animate={{
                                left: formMode === "project" ? "4px" : "50%",
                                width: "calc(50% - 4px)",
                                x: formMode === "project" ? 0 : 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            type="button"
                            onClick={() => setFormMode("project")}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${formMode === "project" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Start Project
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormMode("feedback")}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${formMode === "feedback" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Give Feedback
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Name
                            </label>
                            <input
                                required
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50"
                            />
                        </div>

                        {formMode === "project" ? (
                            <div className="space-y-2">
                                <label htmlFor="phone" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Phone
                                </label>
                                <input
                                    required
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label htmlFor="company" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Company (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Acme Inc."
                                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <input
                                required
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@company.com"
                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50"
                            />
                        </div>

                        {formMode === "feedback" && (
                            <div className="space-y-2">
                                <label htmlFor="role" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Role (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="CEO / Director"
                                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50"
                                />
                            </div>
                        )}
                    </div>

                    {formMode === "project" ? (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="business_description" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Business Description
                                </label>
                                <textarea
                                    required
                                    id="business_description"
                                    name="business_description"
                                    value={formData.business_description}
                                    onChange={handleChange}
                                    placeholder="Tell us about your company and what you do..."
                                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="requirements" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Project Requirements
                                </label>
                                <textarea
                                    required
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder="What validation do you need? Specific features, timeline, etc."
                                    className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all focus:border-primary/50"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="photo" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Photo (Optional)
                                </label>
                                <div className="flex items-center gap-4">
                                    {previewUrl ? (
                                        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border">
                                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={clearFile}
                                                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-dashed border-muted-foreground/30">
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="photo"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50 pt-3"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Your Message
                                </label>
                                <textarea
                                    required
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we improve? What's on your mind?"
                                    className="flex min-h-[150px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all focus:border-primary/50"
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    {formMode === "project" ? "Send Project Request" : "Send Feedbacks"}
                                    <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {status === "success" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-green-500/10 text-green-500 text-sm text-center font-medium border border-green-500/20"
                        >
                            Thank you! Your message has been sent successfully. We'll be in touch soon.
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center font-medium border border-destructive/20"
                        >
                            Something went wrong. Please try again later.
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    )

    if (embedded) {
        return content
    }

    return (
        <section className="pt-0 pb-24 relative overflow-hidden">
            {content}
        </section>
    )
}
