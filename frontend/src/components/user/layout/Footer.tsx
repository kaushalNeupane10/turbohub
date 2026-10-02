
import Link from "next/link";
import NewsletterSection from "./NewsLetterSection";
import { Mail, MessageCircle } from "lucide-react";
import {
  CiFacebook,
  CiInstagram,
  CiLinkedin,
  CiTwitter,
} from "react-icons/ci";

const exploreLinks = [
  { label: "Browse Vehicles", href: "/vehicles" },
  { label: "About Us", href: "/about" },
  { label: "My Bookings", href: "/bookings" },
  { label: "How It Works", href: "/how-it-works" },
];

const vehicleLinks = [
  { label: "Cars", href: "/vehicles?type=cars" },
  { label: "SUVs", href: "/vehicles?type=suvs" },
  { label: "Motorcycles", href: "/vehicles?type=motorcycles" },
  { label: "Electric Vehicles", href: "/vehicles?type=electric" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Rental Guide", href: "/rental-guide" },
  { label: "FAQs", href: "/faqs" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Rental Agreement", href: "/rental-agreement" },
  { label: "Insurance & Protection", href: "/insurance" },
];

const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: CiFacebook,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: CiInstagram,
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    icon: CiTwitter,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: CiLinkedin,
  },
];

interface FooterColumnProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-text-heading">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="
                text-sm text-text-muted
                transition-colors duration-200
                hover:text-brand
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialIconProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

function SocialIcon({ href, label, icon: Icon }: SocialIconProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl border border-border
        bg-bg-surface
        text-text-muted
        transition-all duration-300
        hover:border-brand/40
        hover:bg-brand
        hover:text-brand-foreground
      "
    >
      <Icon size={17} strokeWidth={2} />
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border/80 bg-bg-sunken">
      <NewsletterSection />

      {/* Main Footer */}
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="TurboHub home"
            >
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl bg-brand
                  text-sm font-black
                  text-brand-foreground
                  shadow-brand
                "
              >
                T
              </div>

              <span className="text-lg font-black tracking-wider text-text-heading">
                TURBOHUB
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-muted">
              Your trusted vehicle rental platform. Discover, compare, and
              reserve cars, SUVs, motorcycles, and electric vehicles with
              confidence.
            </p>

            {/* Contact */}
            <div className="mt-5 space-y-2">
              <Link
                href="/contact"
                className="
                  inline-flex items-center gap-2
                  text-sm text-text-muted
                  transition-colors
                  hover:text-brand
                "
              >
                <Mail size={15} />
                Contact our team
              </Link>

              <Link
                href="/help"
                className="
                  flex items-center gap-2
                  text-sm text-text-muted
                  transition-colors
                  hover:text-brand
                "
              >
                <MessageCircle size={15} />
                Get rental support
              </Link>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <SocialIcon
                  key={social.label}
                  href={social.href}
                  label={social.label}
                  icon={social.icon}
                />
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <FooterColumn title="Explore" links={exploreLinks} />

          <FooterColumn title="Vehicles" links={vehicleLinks} />

          <FooterColumn title="Support" links={supportLinks} />

          <FooterColumn title="Legal" links={legalLinks} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30 bg-bg-page/50">
        <div
          className="
            mx-auto flex max-w-[1280px]
            flex-col gap-3 px-4 py-5
            text-center
            sm:flex-row sm:items-center
            sm:justify-between sm:px-6
            sm:text-left lg:px-8
          "
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            © {new Date().getFullYear()} TURBOHUB. ALL RIGHTS RESERVED.
          </p>

          <p className="text-[11px] font-medium text-text-muted">
            Drive more. Worry less.
          </p>
        </div>
      </div>
    </footer>
  );
}
