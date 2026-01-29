
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ServiceDetails } from "../components/services/service-details";
import { PageTransition } from "../components/layout/page-transition";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/database";
import {
    Code, Smartphone, Globe, Cloud, Database as DBIcon, BarChart, PenTool, Shield, Zap,
    Layers, Cpu, Server, Lock, Search, Terminal, Layout, Monitor, Wifi,
    MessageSquare, Settings, Hash, Box, Activity
} from "lucide-react";

type ServiceDetail = Database['public']['Tables']['service_details']['Row'];

// Icon mapping (Same as in services-preview)
const iconMap: Record<string, any> = {
    Globe, Smartphone, Code, PenTool, Cloud, Database: DBIcon, BarChart, Shield, Zap,
    Layers, Cpu, Server, Lock, Search, Terminal, Layout, Monitor, Wifi,
    MessageSquare, Settings, Hash, Box, Activity
};

export function Services() {
    const [services, setServices] = useState<ServiceDetail[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            const { data } = await supabase
                .from('service_details')
                .select('*')
                .order('created_at', { ascending: true });

            if (data) {
                const servicesData = data as ServiceDetail[];
                setServices(servicesData);
                // Open the first one by default if exists
                if (servicesData.length > 0) {
                    setExpandedId(servicesData[0].id);
                }
            }
            setLoading(false);
        }
        fetchServices();
    }, []);

    const getIcon = (name: string) => {
        const IconComponent = iconMap[name] || Globe;
        return IconComponent;
    };

    return (
        <PageTransition>
            <div className="container py-20 min-h-screen">
                <div className="mb-16 text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Our Services</h1>
                    <p className="text-xl text-muted-foreground">
                        Comprehensive digital solutions tailored to help your business grow and succeed in the modern era.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center">Loading services...</div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {services.length === 0 && <p className="text-center text-muted-foreground">No services configured yet.</p>}

                        {services.map((service) => {
                            const isExpanded = expandedId === service.id;
                            const Icon = getIcon(service.icon_name);

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={false}
                                    animate={{
                                        backgroundColor: isExpanded ? "hsl(var(--card))" : "hsl(var(--card)/0.5)",
                                        borderColor: isExpanded ? "hsl(var(--primary)/0.5)" : "hsl(var(--border))",
                                    }}
                                    className={cn(
                                        "group rounded-3xl border overflow-hidden transition-all duration-300",
                                        isExpanded ? "shadow-2xl ring-1 ring-primary/20" : "hover:bg-card/80 hover:border-primary/30"
                                    )}
                                >
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : service.id)}
                                        className="flex items-center justify-between w-full p-6 md:p-8 text-left outline-none"
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className={cn(
                                                "p-3 md:p-4 rounded-2xl transition-colors duration-300",
                                                isExpanded ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                                            )}>
                                                <Icon className="w-6 h-6 md:w-10 md:h-10" />
                                            </div>
                                            <div>
                                                <h3 className={cn(
                                                    "text-xl md:text-3xl font-bold transition-colors",
                                                    isExpanded ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                )}>
                                                    {service.header_title}
                                                </h3>
                                                {!isExpanded && (
                                                    <p className="hidden md:block mt-1 text-muted-foreground">
                                                        {service.header_description.substring(0, 100)}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "p-2 rounded-full border transition-all duration-300",
                                            isExpanded ? "bg-primary text-primary-foreground border-primary rotate-180" : "border-border text-muted-foreground group-hover:border-primary group-hover:text-primary"
                                        )}>
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 pt-0 md:p-8 md:pt-0">
                                                    <div className="h-px w-full bg-border/50 mb-8" />
                                                    <ServiceDetails
                                                        service={service}
                                                    // We don't pass icon here as it's in the header now
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
