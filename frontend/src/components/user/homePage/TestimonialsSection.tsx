"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  review: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Canyon Trail Rider",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    review:
      "Renting the KTM dirt bike was an absolute dream. Checkout was seamless and the pre-configured trail maps made the entire adventure effortless.",
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Corporate Executive",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    review:
      "The Tesla Model S arrived spotless and fully charged. Smartphone unlocking felt incredibly futuristic. This is how luxury rentals should work.",
  },
  {
    id: 3,
    name: "Jordan Blake",
    role: "Motorcycle Enthusiast",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    review:
      "No hidden fees, no long queues, and no sales pressure. I picked up the Ducati and was on the road within minutes.",
  },
  {
    id: 4,
    name: "Elena Rostova",
    role: "Adventurer & Camper",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    review:
      "Outstanding vehicle collection. Renting the Bronco for a weekend camping trip was one of the best travel experiences I've had.",
  },
];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const amount = containerRef.current.clientWidth * 0.85;

    containerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="testimonials"
      className="border-y border-border/30 bg-bg-surface py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand">
              Community Reviews
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-text-heading sm:text-4xl lg:text-5xl">
              Verified Rider Stories
            </h2>
          </div>

          <div className="hidden gap-3 md:flex">
            <button
              aria-label="Previous testimonials"
              onClick={() => scroll("left")}
              className="
                flex h-12 w-12 items-center justify-center
                rounded-xl border border-border
                bg-bg-page
                transition-all duration-300
                hover:border-brand/40
                hover:text-brand
              "
            >
              <ChevronLeft size={20} />
            </button>

            <button
              aria-label="Next testimonials"
              onClick={() => scroll("right")}
              className="
                flex h-12 w-12 items-center justify-center
                rounded-xl border border-border
                bg-bg-page
                transition-all duration-300
                hover:border-brand/40
                hover:text-brand
              "
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials */}
        <div
          ref={containerRef}
          className="
            flex gap-6 overflow-x-auto
            scroll-smooth snap-x snap-mandatory
            pb-4
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="
                snap-start
                min-w-[290px]
                sm:min-w-[360px]
                lg:min-w-[420px]
                flex flex-col
                justify-between

                rounded-3xl
                border border-border/80
                bg-bg-elevated

                p-6 sm:p-8
                transition-all duration-300

                hover:border-brand/30
                hover:shadow-lg
              "
            >
              <div>
                {/* Rating */}
                <div className="mb-5 flex gap-1">
                  {Array.from({
                    length: testimonial.rating,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Review */}
                <blockquote className="text-sm italic leading-relaxed text-text-muted sm:text-base">
                  "{testimonial.review}"
                </blockquote>
              </div>

              {/* User */}
              <div className="mt-8 flex items-center gap-4 border-t border-border/40 pt-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-brand/20 bg-bg-sunken">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-text-heading">
                    {testimonial.name}
                  </h3>

                  <p className="text-xs text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Controls */}
        <div className="mt-8 flex justify-center gap-3 md:hidden">
          <button
            aria-label="Previous testimonials"
            onClick={() => scroll("left")}
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl border border-border
              bg-bg-page
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            aria-label="Next testimonials"
            onClick={() => scroll("right")}
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl border border-border
              bg-bg-page
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
