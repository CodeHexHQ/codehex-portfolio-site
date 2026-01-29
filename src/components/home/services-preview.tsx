
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useOutsideClick } from "../../hooks/use-outside-click"
import {
    Code, Smartphone, Globe, Cloud, Database, BarChart, PenTool, Shield, Zap,
    Layers, Cpu, Server, Lock, Search, Terminal, Layout, Monitor, Wifi,
    MessageSquare, Settings, Hash, Box, Activity
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { X, ChevronRight } from "lucide-react"
import type { Database as DBTypes } from "../../types/database"

// Icon mapping
const iconMap: Record<string, any> = {
    Globe, Smartphone, Code, PenTool, Cloud, Database, BarChart, Shield, Zap,
    Layers, Cpu, Server, Lock, Search, Terminal, Layout, Monitor, Wifi,
    MessageSquare, Settings, Hash, Box, Activity
};

type ServiceDetail = DBTypes['public']['Tables']['service_details']['Row'];

export function ServicesPreview() {
    const [services, setServices] = useState<ServiceDetail[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLElement>(null)

    useOutsideClick(ref, () => setSelectedId(null))

    useEffect(() => {
        async function fetchServices() {
            const { data } = await supabase
                .from('service_details')
                .select('*')
                .order('created_at', { ascending: true });

            if (data) setServices(data);
        }
        fetchServices();
    }, []);

    const selectedService = services.find(s => s.id === selectedId)

    // Scroll-based width animation
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.8", "start 0.3"]
    })

    // Transform scroll progress to width percentage (80% to 100%)
    const width = useTransform(scrollYProgress, [0, 1], ["80%", "100%"])

    const getIcon = (name: string) => {
        const IconComponent = iconMap[name] || Globe;
        return IconComponent;
    };

    return (
        <section ref={sectionRef} className="relative overflow-hidden pt-0 pb-10 bg-background">
            <motion.div
                style={{ width }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
                className="relative mx-auto bg-muted/50 dark:bg-muted/30 rounded-3xl shadow-xl"
            >
                <div className="px-4 py-8">
                    <div className="mb-6 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold tracking-tight sm:text-4xl text-black dark:text-white"
                        >
                            Our <span className="text-primary">Services</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
                        >
                            Comprehensive digital solutions for every stage of your business growth. Click on a card to learn more.
                        </motion.p>
                    </div>

                    <div className="container mx-auto">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => {
                                const Icon = getIcon(service.icon_name);
                                return (
                                    <motion.div
                                        layoutId={`card-${service.id}`}
                                        key={service.id}
                                        onClick={() => setSelectedId(service.id)}
                                        whileHover={{ scale: 1.02 }}
                                        className="group relative cursor-pointer overflow-hidden rounded-xl bg-card p-4 shadow-sm border transition-colors hover:border-primary/50 dark:hover:border-primary/50"
                                    >
                                        <motion.div
                                            layoutId={`icon-container-${service.id}`}
                                            className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                        >
                                            <Icon className="h-6 w-6" />
                                        </motion.div>
                                        <motion.h3 layoutId={`title-${service.id}`} className="mb-1 text-lg font-bold leading-tight">{service.card_title}</motion.h3>
                                        <motion.p layoutId={`desc-${service.id}`} className="text-sm text-muted-foreground line-clamp-2">{service.card_description}</motion.p>

                                        <div className="mt-2 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                            Learn more <ChevronRight className="ml-1 h-3 w-3" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedId && selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setSelectedId(null)}
                        />

                        {/* Expanded Card */}
                        <motion.div
                            layoutId={`card-${selectedId}`}
                            ref={ref}
                            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card p-6 shadow-2xl border border-primary/20"
                        >
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <motion.div
                                layoutId={`icon-container-${selectedId}`}
                                className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary"
                            >
                                {(() => {
                                    const Icon = getIcon(selectedService.icon_name);
                                    return <Icon className="h-8 w-8" />;
                                })()}
                            </motion.div>

                            <motion.h3 layoutId={`title-${selectedId}`} className="mb-2 text-2xl font-bold">
                                {selectedService.card_title}
                            </motion.h3>

                            <motion.p layoutId={`desc-${selectedId}`} className="mb-6 text-lg text-muted-foreground">
                                {selectedService.card_description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.2 }}
                                className="relative space-y-4"
                            >
                                <div className="rounded-lg bg-muted p-4">
                                    <h4 className="mb-2 font-semibold text-foreground">Overview</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedService.header_description} {/* Fallback to header description or create a new field if needed, but header_description works for detailed view */}
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
