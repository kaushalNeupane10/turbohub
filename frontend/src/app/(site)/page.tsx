import ExperienceSection from "@/components/user/homePage/ExperienceSection";
import FaqSection from "@/components/user/homePage/FaqSection";
import Hero from "@/components/user/homePage/Hero";
import HowItWorksSection from "@/components/user/homePage/HowItWorksSection";
import TestimonialSection from "@/components/user/homePage/TestimonialsSection";

export default function page() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <FaqSection />
      <HowItWorksSection />
      <TestimonialSection />
    </>
  );
}
