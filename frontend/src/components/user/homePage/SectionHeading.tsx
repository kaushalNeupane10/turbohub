import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional "view all" link rendered on the right (desktop) / below (mobile). */
  actionHref?: string;
  actionLabel?: string;
}

/**
 * Shared marketing section heading used across the public homepage sections.
 * Matches the eyebrow → title → description rhythm of ExperienceSection /
 * HowItWorksSection.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel = "View all",
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
      <div className="max-w-2xl space-y-3">
        <span className="inline-block text-xs font-extrabold uppercase tracking-[0.3em] text-brand">
          {eyebrow}
        </span>
        <h2 className="text-balance text-3xl font-black tracking-tight text-text-heading sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="text-pretty text-base leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>

      {actionHref && (
        <Link
          href={actionHref}
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-body transition-all hover:border-brand/40 hover:text-brand"
        >
          {actionLabel}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
