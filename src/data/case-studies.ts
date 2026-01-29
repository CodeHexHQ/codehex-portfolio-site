export interface CaseStudy {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    color: string;
}

export const caseStudies: CaseStudy[] = [
    {
        id: 1,
        title: "FinTech Dashboard Revamp",
        category: "Web Application",
        description: "Modernizing a legacy financial platform with React and real-time data visualization. We improved performance by 300% and redesigned the UX for better data accessibility.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        color: "#1e293b" // slate-800
    },
    {
        id: 2,
        title: "E-Commerce Mobile App",
        category: "Mobile Development",
        description: "A seamless shopping experience built with React Native for iOS and Android. Features include AI-powered recommendations, AR product preview, and one-tap checkout.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2670&auto=format&fit=crop",
        color: "#0f172a" // slate-900 (darker)
    },
    {
        id: 3,
        title: "Healthcare Patient Portal",
        category: "Custom Software",
        description: "Secure and intuitive portal for patient management and appointment scheduling. Fully HIPAA compliant with telemedicine integration and electronic health record syncing.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop",
        color: "#172554" // blue-950
    },
    {
        id: 4,
        title: "Smart Logistics Tracker",
        category: "IoT Solution",
        description: "Real-time fleet tracking and supply chain management system using IoT sensors. Reduced delivery delays by 40% through predictive route optimization algorithms.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
        color: "#111827" // gray-900
    }
];
