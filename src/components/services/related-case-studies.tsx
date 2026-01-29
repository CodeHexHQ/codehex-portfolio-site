
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "../../data/services";
import { useRef } from "react";

interface RelatedCaseStudiesProps {
    studies: CaseStudy[];
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
    const ref = useRef<HTMLAnchorElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={ref}
            href={study.link}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all"
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div
                className="relative aspect-video overflow-hidden"
                style={{ transform: "translateZ(50px)" }}
            >
                <img
                    src={study.image}
                    alt={study.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium flex items-center gap-2">
                        View Case Study <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
            <div
                className="p-4 bg-card/80 backdrop-blur-sm"
                style={{ transform: "translateZ(75px)" }}
            >
                <p className="text-xs text-muted-foreground">{study.client}</p>
                <h4 className="font-semibold">{study.title}</h4>
            </div>
        </motion.a>
    );
}

export function RelatedCaseStudies({ studies }: RelatedCaseStudiesProps) {
    if (studies.length === 0) return null;

    return (
        <div className="mt-12 pt-12 border-t">
            <h3 className="text-2xl font-bold mb-6">Related Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">
                {studies.map((study) => (
                    <CaseStudyCard key={study.id} study={study} />
                ))}
            </div>
        </div>
    );
}
