"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What license matches specific vehicle classifications?",
    answer:
      "Cars require a standard driver's license. Street motorcycles require a valid motorcycle endorsement, while certain off-road vehicles may have different local requirements depending on your region.",
  },
  {
    id: 2,
    question: "How are insurance liabilities processed?",
    answer:
      "Basic liability protection is included with every booking. During checkout, you can upgrade to premium protection plans with lower deductibles and expanded coverage.",
  },
  {
    id: 3,
    question: "Can I customize pick-up and drop-off locations?",
    answer:
      "Yes. Many rentals support flexible pickup and return locations. Availability depends on vehicle type and operational coverage areas.",
  },
  {
    id: 4,
    question: "Are helmets and safety gear included?",
    answer:
      "Absolutely. Riders can add premium safety packages that include helmets, protective equipment, and other ride-specific accessories.",
  },
];

export default function FaqSection() {
  const [openItem, setOpenItem] = useState<number | null>(1);

  const toggleItem = (id: number) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="
        border-b border-border/30
        bg-bg-elevated
        py-16 sm:py-20 lg:py-28
      "
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand">
                Common Queries
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-text-heading sm:text-4xl lg:text-5xl">
                Got Questions?
                <br />
                We Have Answers.
              </h2>

              <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
                Can't find the information you're looking for? Our support team
                is available around the clock to help with bookings, vehicle
                selection, and account questions.
              </p>

              <div className="mt-8">
                <a
                  href="mailto:support@veloce.com"
                  className="
                    inline-flex items-center gap-2
                    font-semibold text-brand
                    transition-colors
                    hover:opacity-80
                  "
                >
                  Email Customer Care
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openItem === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border border-border/80
                      bg-bg-surface
                      shadow-sm
                    "
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${faq.id}`}
                      className="
                        flex w-full items-center
                        justify-between gap-4
                        px-5 py-5 sm:px-6
                        text-left
                        transition-colors
                        hover:text-brand
                      "
                    >
                      <span className="font-semibold text-text-heading">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`
                          shrink-0 text-brand
                          transition-transform duration-300
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    <div
                      id={`faq-content-${faq.id}`}
                      className={`
                        grid transition-all duration-300 ease-in-out
                        ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-border/20 px-5 pb-5 pt-4 sm:px-6">
                          <p className="text-sm leading-relaxed text-text-muted sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
