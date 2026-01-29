
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/animations";
import { RelatedCaseStudies } from "./related-case-studies";
import { ContactForm } from "../home/contact-form";
import { useState } from "react";
import React from "react";
import type { Database } from "../../types/database";

type ServiceDetailRow = Database['public']['Tables']['service_details']['Row'];

function TechBadge({ item }: { item: { name: string; icon: string; description: string } }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors cursor-default"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="text-sm font-medium">{item.name}</span>
            </motion.div>

            {/* Custom Animated Tooltip */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border w-48 text-center z-50 pointer-events-none"
                >
                    <p className="font-semibold mb-1">{item.name}</p>
                    <p className="text-muted-foreground">{item.description}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-popover" />
                </motion.div>
            )}
        </div>
    )
}

interface ServiceDetailsProps {
    service: ServiceDetailRow;
    icon?: React.ElementType;
}

export function ServiceDetails({ service, icon: Icon }: ServiceDetailsProps) {
    // Cast JSON fields to expected types
    const techStack = (service.tech_stack as any[]) || [];
    const successStories = (service.success_stories as any[]) || [];
    const benefits = service.benefits || [];

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
        >
            <div className="space-y-4">
                {Icon && (
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-block p-3 rounded-2xl bg-primary/10 mb-4"
                    >
                        <Icon className="w-8 h-8 text-primary" />
                    </motion.div>
                )}
                <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight">
                    {service.header_title}
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed">
                    {service.header_description}
                </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-accent/20 border border-accent/20">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                        <span className="font-medium">{benefit}</span>
                    </div>
                ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl font-semibold">Technologies We Use</h3>
                <div className="flex flex-wrap gap-3">
                    {techStack.map((tech) => (
                        <TechBadge key={tech.name} item={tech} />
                    ))}
                </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
                {/* Need to ensure RelatedCaseStudies accepts the new format or map it */}
                <RelatedCaseStudies studies={successStories.map((s: any) => ({
                    id: s.link || s.title, // Use link or title as ID if not present
                    title: s.title,
                    client: s.client,
                    image: s.image_url,
                    link: s.link
                }))} />
            </motion.div>

            <motion.div variants={fadeInUp}>
                <ContactForm embedded serviceTitle={service.header_title} />
            </motion.div>
        </motion.div>
    );
}
