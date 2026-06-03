import { Car, BadgeCheck, KeyRound } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Car,
    title: "Configure Your Dream Ride",
    description:
      "Choose from our premium fleet, select rental dates, and customize your experience with protection plans and accessories.",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "Rapid Verification",
    description:
      "Complete secure identity verification with your driver's license and required credentials in just a few moments.",
  },
  {
    number: "03",
    icon: KeyRound,
    title: "Claim & Ignite",
    description:
      "Unlock your vehicle digitally, complete a quick inspection, and begin your journey without waiting in line.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-border/30 bg-bg-elevated py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.3em] text-brand">
            Three Easy Phases
          </span>

          <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-text-heading sm:text-4xl lg:text-5xl">
            Select. Secure. Speed Away.
          </h2>

          <p className="mt-4 text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
            Rent premium vehicles in minutes through a seamless, fully digital
            experience.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop Connection Line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[52px] hidden md:block"
          >
            <div className="mx-auto h-px w-[70%] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="
                    group relative
                    rounded-3xl
                    border border-border/80
                    bg-bg-surface
                    p-6 sm:p-8
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-brand/40
                    hover:shadow-lg
                  "
                >
                  {/* Step Number */}
                  <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
                    <span className="text-xl font-black">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-5 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/5 text-brand transition-transform duration-300 group-hover:scale-110">
                      <Icon size={24} strokeWidth={2.2} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-text-heading">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover Glow */}
                  <div
                    aria-hidden="true"
                    className="
                      absolute inset-0 rounded-3xl
                      opacity-0
                      transition-opacity duration-300
                      group-hover:opacity-100
                    "
                    style={{
                      boxShadow:
                        "0 0 0 1px rgb(38 178 217 / 0.15), 0 0 40px rgb(38 178 217 / 0.08)",
                    }}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
