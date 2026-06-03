"use client";

import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Vehicle } from "@/types/vehicle_card.types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onRent?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onRent }: VehicleCardProps) {
  return (
    <article
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/80 bg-bg-surface",
        "transition-all duration-300",
        "hover:border-brand/40 hover:shadow-xl",
      )}
      data-category={vehicle.category}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-bg-sunken">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Availability */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-bg-surface/90 px-3 py-1 backdrop-blur-md">
            <span
              className={clsx(
                "h-2.5 w-2.5 rounded-full",
                vehicle.available ? "bg-success animate-pulse" : "bg-error",
              )}
            />

            <span className="text-xs font-bold text-text-heading">
              {vehicle.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute right-3 top-3 rounded-lg bg-brand/90 px-3 py-1.5 text-xs font-black tracking-wider text-brand-foreground backdrop-blur-md">
          {vehicle.badge}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand">
              {vehicle.tagline}
            </span>

            <div className="flex items-center gap-1 text-xs font-bold text-warning">
              <Star className="h-3.5 w-3.5 fill-current" />
              {vehicle.rating} ({vehicle.reviews})
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-text-heading">
            {vehicle.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">
            {vehicle.description}
          </p>

          {/* Features */}
          <div className="my-5 grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-bg-page/80 p-3 text-center">
            {vehicle.features.map((feature) => (
              <div key={feature.label} className="flex flex-col items-center">
                <div className="mb-1 text-brand">{feature.icon}</div>

                <span className="text-[11px] font-bold text-text-heading">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-4">
          <div>
            <span className="block text-xs font-bold uppercase text-text-muted">
              Daily Rate
            </span>

            <span className="text-2xl font-black text-brand">
              ${vehicle.pricePerDay}
              <span className="text-sm font-medium text-text-body">/day</span>
            </span>
          </div>

          <button
            onClick={() => onRent?.(vehicle)}
            disabled={!vehicle.available}
            className={clsx(
              "flex items-center gap-2 rounded-xl px-5 py-3 font-bold transition-all",
              vehicle.available
                ? "bg-brand text-brand-foreground hover:bg-brand-dark hover:shadow-brand"
                : "cursor-not-allowed bg-bg-sunken text-text-muted",
            )}
          >
            Rent Ride
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
