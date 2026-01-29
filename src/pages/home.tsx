import { PageTransition } from "../components/layout/page-transition"
import { HeroSection } from "../components/home/hero-section"
import { ServicesPreview } from "../components/home/services-preview"
import { CaseStudyCarousel } from "../components/home/case-study-carousel"
import { TestimonialsSlider } from "../components/home/testimonials-slider"
import { TechStack } from "../components/home/tech-stack"

import { ContactForm } from "../components/home/contact-form"
import { Footer } from "../components/layout/footer"

export function Home() {
    return (
        <PageTransition>
            <div className="flex flex-col">
                <HeroSection />
                <ServicesPreview />
                <CaseStudyCarousel />
                <TestimonialsSlider />
                <TechStack />
                <ContactForm />
                <Footer />
            </div>
        </PageTransition>
    )
}
