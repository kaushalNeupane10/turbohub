"use client";

import Image from "next/image";
import { Star, ChevronRight, Crown, TrendingUp, MapPin } from "lucide-react";
import clsx from "clsx";
import { Vehicle } from "@/types/vehicle_card.types";
import Link from "next/link";

interface VehicleCardProps {
  vehicle: Vehicle;
  /** Show rank badge (1-based). Only used in the Top Rented section. */
  rank?: number;
  /**
   * Optional priority hint for the cover image (LCP optimisation for
   * above-the-fold cards). Defaults to false.
   */
  priority?: boolean;
}

const RANK_STYLES: Record<number, string> = {
  1: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
  2: "bg-gradient-to-r from-neutral-300 to-neutral-400 text-neutral-800",
  3: "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
};

export default function VehicleCard({
  vehicle,
  rank,
  priority = false,
}: VehicleCardProps) {
  const coverImage = vehicle.image;
  const detailHref = `/vehicles/${vehicle.id}`;

  return (
    <article
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/80 bg-bg-surface",
        "transition-all duration-300",
        "hover:border-brand/40 hover:shadow-xl hover:-translate-y-0.5",
      )}
      data-category={vehicle.category}
      data-vehicle-id={vehicle.id}
    >
      {/* Image Section — the whole media area links to the detail page */}
      <Link
        href={detailHref}
        aria-label={`View ${vehicle.name} details`}
        className="relative block h-56 overflow-hidden bg-bg-sunken"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={vehicle.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback placeholder when no image is set */
          <div className="flex h-full w-full items-center justify-center bg-bg-elevated">
            <span className="text-4xl opacity-30">🚗</span>
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-bg-surface/90 px-3 py-1 backdrop-blur-md">
            <span
              className={clsx(
                "h-2.5 w-2.5 rounded-full",
                vehicle.available ? "animate-pulse bg-success" : "bg-error",
              )}
            />
            <span className="text-xs font-bold text-text-heading">
              {vehicle.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Rank badge (top-rented section) */}
        {rank && rank <= 3 && (
          <div
            className={clsx(
              "absolute left-3 top-3 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black shadow-md",
              RANK_STYLES[rank] ?? "bg-brand/90 text-brand-foreground",
            )}
            aria-label={`Rank ${rank}`}
          >
            #{rank}
          </div>
        )}
        {rank && rank > 3 && (
          <div className="absolute left-3 top-3 rounded-lg bg-bg-surface/80 px-2.5 py-1 text-xs font-bold text-text-muted backdrop-blur-md">
            #{rank}
          </div>
        )}

        {/* Featured crown badge */}
        {vehicle.isFeatured && !rank && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-amber-400/90 px-2.5 py-1 text-xs font-black text-amber-900 backdrop-blur-md shadow-md">
            <Crown size={11} />
            Featured
          </div>
        )}

        {/* Category badge */}
        <div className="absolute right-3 top-3 rounded-lg bg-brand/90 px-3 py-1.5 text-xs font-black tracking-wider text-brand-foreground backdrop-blur-md">
          {vehicle.badge}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Header row */}
          <div className="mb-2 flex items-start justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand">
              {vehicle.tagline}
            </span>

            <div className="flex items-center gap-1 text-xs font-bold text-warning">
              <Star className="h-3.5 w-3.5 fill-current" />
              {vehicle.rating.toFixed(1)}
              <span className="font-normal text-text-muted">
                ({vehicle.reviews})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-text-heading">
            <Link
              href={detailHref}
              className="outline-none transition-colors hover:text-brand focus-visible:text-brand"
            >
              {vehicle.name}
            </Link>
          </h3>

          {/* Description */}
          <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">
            {vehicle.description}
          </p>

          {/* Location + Bookings stat row */}
          <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-brand" />
              {vehicle.location}
            </span>
            {vehicle.bookingCountThisWeek != null &&
              vehicle.bookingCountThisWeek > 0 && (
                <span className="flex items-center gap-1 font-semibold text-brand">
                  <TrendingUp size={11} />
                  {vehicle.bookingCountThisWeek} booked this week
                </span>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
          <div className="min-w-0">
            <span className="block text-xs font-bold uppercase text-text-muted">
              Daily Rate
            </span>
            <span className="text-xl font-black tabular-nums text-brand">
              ${vehicle.pricePerDay.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              <span className="text-sm font-medium text-text-body">/day</span>
            </span>
          </div>

          <Link
            id={`book-vehicle-${vehicle.id}`}
            href={detailHref}
            aria-label={`Book ${vehicle.name}`}
            className={clsx(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
              vehicle.available
                ? "bg-brand text-brand-foreground hover:bg-brand-dark hover:shadow-brand"
                : "bg-bg-sunken text-text-muted hover:bg-bg-elevated",
            )}
          >
            {vehicle.available ? "Book Now" : "Details"}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
