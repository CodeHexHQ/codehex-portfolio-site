
import { motion } from "framer-motion";
import { type ServiceCategory } from "../../data/services";
import { cn } from "../../lib/utils";

interface ServicesSidebarProps {
    categories: ServiceCategory[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export function ServicesSidebar({ categories, selectedId, onSelect }: ServicesSidebarProps) {
    return (
        <div className="flex flex-col space-y-2 sticky top-24">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        "relative w-full text-left px-4 py-3 rounded-lg transition-colors group",
                        selectedId === category.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    {selectedId === category.id && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-primary rounded-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-3 font-medium">
                        <category.icon className="h-4 w-4" />
                        {category.title}
                    </span>
                </button>
            ))}
        </div>
    );
}
