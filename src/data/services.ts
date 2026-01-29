
import { type LucideIcon, Paintbrush, LineChart, Smartphone, Globe, Cloud, BarChart, Cpu } from "lucide-react";

export interface ServiceCategory {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface TechItem {
    name: string;
    icon: string; // URL or Lucide icon name if using dynamic icons
    description: string;
}

export interface CaseStudy {
    id: string;
    title: string;
    client: string;
    image: string;
    link: string;
}

export interface ServiceDetail {
    categoryId: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    benefits: string[];
    techStack: TechItem[];
    relatedCaseStudies: CaseStudy[];
}

export const serviceCategories: ServiceCategory[] = [
    {
        id: "web-dev",
        title: "Web Development",
        description: "Custom websites and web applications built with modern technologies.",
        icon: Globe,
    },
    {
        id: "mobile-dev",
        title: "Mobile Development",
        description: "Native and cross-platform mobile apps for iOS and Android.",
        icon: Smartphone,
    },
    {
        id: "ui-ux",
        title: "UI/UX Design",
        description: "User-centered design that drives engagement and conversion.",
        icon: Paintbrush,
    },
    {
        id: "cloud",
        title: "Cloud Solutions",
        description: "Scalable cloud infrastructure and DevOps services.",
        icon: Cloud,
    },
    {
        id: "digital-marketing",
        title: "Digital Marketing",
        description: "Data-driven marketing strategies to grow your business.",
        icon: LineChart,
    },
    {
        id: "data-analytics",
        title: "Data Analytics",
        description: "Turn raw data into actionable insights.",
        icon: BarChart,
    },
    {
        id: "automation",
        title: "Automation",
        description: "Streamline operations with intelligent automation.",
        icon: Cpu,
    },
];

export const servicesData: Record<string, ServiceDetail> = {
    "web-dev": {
        categoryId: "web-dev",
        title: "Custom Web Development",
        shortDescription: "We build fast, responsive, and SEO-friendly websites.",
        fullDescription: "Our web development team specializes in creating high-performance, scalable web applications tailored to your business needs. From simple brochure sites to complex enterprise platforms, we use the latest technologies to deliver exceptional user experiences.",
        benefits: [
            "Responsive design for all devices",
            "SEO-optimized code structure",
            "High performance and fast loading speeds",
            "Secure and scalable architecture",
        ],
        techStack: [
            { name: "React", icon: "react", description: "Frontend Library" },
            { name: "Next.js", icon: "nextjs", description: "React Framework" },
            { name: "TypeScript", icon: "typescript", description: "Type Safety" },
            { name: "Node.js", icon: "nodejs", description: "Backend Runtime" },
        ],
        relatedCaseStudies: [
            {
                id: "cs1",
                title: "E-commerce Platform Revamp",
                client: "ShopifyPlus",
                image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
                link: "/case-studies/ecommerce",
            },
            {
                id: "cs2",
                title: "SaaS Dashboard Interface",
                client: "DataFlow",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                link: "/case-studies/saas",
            },
        ],
    },
    "mobile-dev": {
        categoryId: "mobile-dev",
        title: "Mobile App Development",
        shortDescription: "Native and cross-platform apps for iOS and Android.",
        fullDescription: "We create intuitive and powerful mobile applications that users love. Whether you need a native iOS implementation or a cross-platform Flutter solution, we have the expertise to bring your mobile strategy to life.",
        benefits: [
            "Native performance and feel",
            "Cross-platform compatibility",
            "Offline capabilities",
            "Push notification integration",
        ],
        techStack: [
            { name: "React Native", icon: "react", description: "Cross-platform" },
            { name: "Flutter", icon: "flutter", description: "Google UI Toolkit" },
            { name: "Swift", icon: "swift", description: "iOS Native" },
            { name: "Kotlin", icon: "kotlin", description: "Android Native" },
        ],
        relatedCaseStudies: [
            {
                id: "cs3",
                title: "Fitness Tracking App",
                client: "FitLife",
                image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
                link: "/case-studies/fitness",
            },
        ],
    },
    "ui-ux": {
        categoryId: "ui-ux",
        title: "UI/UX Design",
        shortDescription: "User-centered design that drives engagement.",
        fullDescription: "Our design process starts with understanding your users. We create wireframes, prototypes, and high-fidelity mockups that not only look beautiful but also solve real user problems and drive conversion.",
        benefits: [
            "User research and persona development",
            "Interactive prototyping",
            "Design systems and style guides",
            "Accessibility compliance",
        ],
        techStack: [
            { name: "Figma", icon: "figma", description: "Design Tool" },
            { name: "Adobe XD", icon: "xd", description: "Prototyping" },
            { name: "Sketch", icon: "sketch", description: "Vector Graphics" },
        ],
        relatedCaseStudies: [],
    },
    "cloud": {
        categoryId: "cloud",
        title: "Cloud Infrastructure",
        shortDescription: "Scalable and secure cloud solutions.",
        fullDescription: "Migrate to the cloud or optimize your existing infrastructure with our DevOps services. We ensure your applications are always available, secure, and cost-effective.",
        benefits: [
            "Automated CI/CD pipelines",
            "Infrastructure as Code",
            "24/7 Monitoring and alerts",
            "Cost optimization strategies",
        ],
        techStack: [
            { name: "AWS", icon: "aws", description: "Cloud Provider" },
            { name: "Docker", icon: "docker", description: "Containerization" },
            { name: "Kubernetes", icon: "kubernetes", description: "Orchestration" },
        ],
        relatedCaseStudies: [],
    },
    "digital-marketing": {
        categoryId: "digital-marketing",
        title: "Digital Marketing Strategies",
        shortDescription: "Grow your reach with data-driven marketing.",
        fullDescription: "From SEO to social media campaigns, we help you reach your target audience and convert them into loyal customers.",
        benefits: [
            "Search Engine Optimization (SEO)",
            "Social Media Management",
            "Content Strategy",
            "Analytics and Reporting",
        ],
        techStack: [
            { name: "Google Analytics", icon: "analytics", description: "Tracking" },
            { name: "SEMrush", icon: "semrush", description: "SEO Tool" },
        ],
        relatedCaseStudies: [],
    },
    "data-analytics": {
        categoryId: "data-analytics",
        title: "Data Analytics & BI",
        shortDescription: "Turn your data into actionable insights.",
        fullDescription: "We help you unlock the true potential of your data. Our analytics and Business Intelligence (BI) solutions provide real-time insights, predictive modeling, and visual dashboards to drive informed decision-making.",
        benefits: [
            "Data Warehousing & ETL",
            "Predictive Analytics",
            "Visual KPI Dashboards",
            "Process Mining",
        ],
        techStack: [
            { name: "Power BI", icon: "powerbi", description: "Visualization" },
            { name: "Python", icon: "python", description: "Data Science" },
            { name: "Snowflake", icon: "snowflake", description: "Data Warehouse" },
        ],
        relatedCaseStudies: [],
    },
    "automation": {
        categoryId: "automation",
        title: "Business Automation",
        shortDescription: "Streamline workflows and reduce manual effort.",
        fullDescription: "From simple task automation to complex business process optimization, we build intelligent bots and systems that save time, reduce error rates, and let your team focus on high-value work.",
        benefits: [
            "Robotic Process Automation (RPA)",
            "Workflow Integration",
            "Chatbots & AI Agents",
            "Legacy System Integration",
        ],
        techStack: [
            { name: "UiPath", icon: "uipath", description: "RPA Platform" },
            { name: "Zapier", icon: "zapier", description: "Integration" },
            { name: "OpenAI API", icon: "openai", description: "AI Logic" },
        ],
        relatedCaseStudies: [],
    }
};
