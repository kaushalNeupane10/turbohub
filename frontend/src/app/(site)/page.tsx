import ExperienceSection from "@/components/user/homePage/ExperienceSection";
import FaqSection from "@/components/user/homePage/FaqSection";
import FeaturedVehiclesSection from "@/components/user/homePage/FeaturedVehiclesSection";
import Hero from "@/components/user/homePage/Hero";
import HowItWorksSection from "@/components/user/homePage/HowItWorksSection";
import TestimonialSection from "@/components/user/homePage/TestimonialsSection";
import TopRentedSection from "@/components/user/homePage/TopRentedSection";

export default function page() {
  return (
    <>
      <Hero />
      <TopRentedSection />
      <FeaturedVehiclesSection />
      <ExperienceSection />
      <HowItWorksSection />
      <FaqSection />
      <TestimonialSection />
    </>
  );
}
