import Link from "next/link";
import NewsletterSection from "./NewsLetterSection";
import { Globe, Send, MessageSquare, Code2 } from "lucide-react";

const rentalZones = [
  "Metropolis Hub",
  "Red Canyon Trails",
  "Pacific Coastline",
  "Mountain Enduro Trails",
];

const fleetClasses = [
  "Luxury & Sports Cars",
  "Off-road Enduro Dirt Bikes",
  "Naked Street Bikes",
  "City Commuter E-Bikes",
];

const legalLinks = [
  "Insurance Safeguards",
  "Terms of Service",
  "Privacy Policy",
  "Rental Agreements",
];

export default function Footer() {
  const SocialIcon = ({
    href,
    label,
    icon,
  }: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }) => (
    <Link
      href={href}
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl border border-border
        bg-bg-surface
        text-text-muted
        transition-all duration-300
        hover:border-brand/40
        hover:text-brand
      "
    >
      {icon}
    </Link>
  );

  const Column = ({ title, items }: { title: string; items: string[] }) => (
    <div>
      <h4 className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-text-heading">
        {title}
      </h4>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link
              href="#"
              className="text-sm text-text-muted transition-colors hover:text-brand"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="border-t border-border/80 bg-bg-sunken">
      <NewsletterSection />

      {/* Main Footer */}
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm font-black text-brand-foreground shadow-brand">
                V
              </div>

              <span className="text-lg font-black tracking-wider text-text-heading">
                VELOCE
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-muted">
              The digital standard for premium vehicle rentals. Explore luxury
              cars, adventure vehicles, motorcycles, and unforgettable driving
              experiences.
            </p>

            {/* Socials (FIXED ICONS) */}
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="#" label="Web" icon={<Globe size={18} />} />
              <SocialIcon href="#" label="Contact" icon={<Send size={18} />} />
              <SocialIcon
                href="#"
                label="Community"
                icon={<MessageSquare size={18} />}
              />
              <SocialIcon href="#" label="Code" icon={<Code2 size={18} />} />
            </div>
          </div>

          {/* Columns */}
          <Column title="Rental Zones" items={rentalZones} />
          <Column title="Fleet Classes" items={fleetClasses} />
          <Column title="Integrity & Rules" items={legalLinks} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30 bg-bg-page/50">
        <div className="mx-auto max-w-[1280px] px-4 py-5 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            © {new Date().getFullYear()} VELOCE MACHINES CO. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
