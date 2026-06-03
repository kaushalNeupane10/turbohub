"use client";

import { FormEvent, useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO:
    // integrate with API
    console.log(email);

    setEmail("");
  };

  return (
    <section className="border-b border-border/30">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-text-heading">
              Subscribe to the Veloce Circuit
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
              Receive exclusive offers, route guides, product announcements, and
              seasonal rental promotions.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="
              flex flex-col gap-3
              sm:flex-row
              lg:justify-end
            "
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="
                h-12 flex-1
                rounded-xl
                border border-border
                bg-bg-surface
                px-4

                text-sm text-text-heading
                outline-none

                focus:border-brand
                focus:ring-2
                focus:ring-brand/20
              "
            />

            <button
              type="submit"
              className="
                h-12 shrink-0
                rounded-xl
                bg-brand
                px-6

                font-semibold
                text-brand-foreground

                transition-all duration-300

                hover:bg-brand-dark
              "
            >
              Join Loop
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
