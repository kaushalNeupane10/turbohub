import Image from "next/image";
import {
  ShieldCheck,
  Smartphone,
  MapPinned,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Total Cover & Comprehensive Liability",
    description:
      "Our comprehensive insurance leaves absolutely no room for stress. We have you protected at every crossroad.",
  },
  {
    icon: Smartphone,
    title: "Contactless Digital Smartphone Unlocking",
    description:
      "Skip lines entirely. Locate, perform safety inspection, and ignite your vehicle directly from your mobile device.",
  },
  {
    icon: MapPinned,
    title: "Unlimited Off-Road Map Licenses",
    description:
      "Dirt bike rentals include integrated Garmin trail maps with legal routes, safety checkpoints, and emergency zones.",
  },
];

const gallery = {
  hero:
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
  secondaryOne:
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
  secondaryTwo:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
};

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Images */}
          <div className="lg:col-span-5">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="group relative overflow-hidden rounded-3xl border border-border bg-bg-surface shadow-lg">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={gallery.hero}
                    alt="Premium motorcycle rental experience"
                    fill
                    priority={false}
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <span className="text-xs font-bold tracking-[0.25em] text-brand-light uppercase">
                    Uncompromising Speed
                  </span>

                  <h3 className="mt-2 max-w-md text-lg font-bold text-white sm:text-xl">
                    Inspected at 50 performance checkpoints before every rental
                  </h3>
                </div>
              </div>

              {/* Secondary Images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-md">
                  <Image
                    src={gallery.secondaryOne}
                    alt="Off-road riding adventure"
                    fill
                    sizes="(max-width:768px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-md">
                  <Image
                    src={gallery.secondaryTwo}
                    alt="Luxury SUV exploration"
                    fill
                    sizes="(max-width:768px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              <div className="max-w-2xl space-y-4">
                <span className="inline-block text-xs font-extrabold uppercase tracking-[0.3em] text-brand">
                  The Veloce Standard
                </span>

                <h2 className="text-balance text-3xl font-black tracking-tight text-text-heading sm:text-4xl lg:text-5xl">
                  Not Just a Rental.
                  <br />
                  An Extraordinary Adventure.
                </h2>

                <p className="text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
                  We focus heavily on visual excellence, premium vehicle
                  integrity, and flawless logistics. Say goodbye to outdated
                  booking counters, hidden fees, and complicated paperwork.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="group flex gap-4 rounded-2xl p-2 transition-all duration-300 hover:bg-bg-elevated"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                        <Icon
                          size={22}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-text-heading">
                          {benefit.title}
                        </h3>

                        <p className="mt-1 text-sm leading-relaxed text-text-muted sm:text-base">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}