"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Crown,
  ShieldCheck,
  Gauge,
  AlertCircle,
} from "lucide-react";

import { useVehicleDetail } from "@/hook/user/vehicle/useVehicleDetail";
import { mapPublicVehicleToCard } from "@/utils/vehicle.utils";
import VehicleGallery from "@/components/user/vehicle/VehicleGallery";
import BookingWidget from "@/components/user/vehicle/BookingWidget";

const CATEGORY_LABELS: Record<string, string> = {
  car: "Car",
  bike: "Bike",
  "dirt-bike": "Dirt Bike",
  suv: "SUV",
  electric: "Electric",
  scooter: "Scooter",
};

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, isError, refetch } = useVehicleDetail(id);

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    return <VehicleDetailSkeleton />;
  }

  // ── Error / not found ────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertCircle size={30} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-text-heading">
          Vehicle not found
        </h1>
        <p className="mt-2 max-w-md text-text-muted">
          This vehicle may no longer be available or the link is incorrect.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-body transition-colors hover:bg-bg-elevated"
          >
            Try again
          </button>
          <Link
            href="/vehicles"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark"
          >
            Browse vehicles
          </Link>
        </div>
      </div>
    );
  }

  const vehicle = mapPublicVehicleToCard(data);
  const categoryLabel =
    CATEGORY_LABELS[data.vehicle_type] ?? data.vehicle_type;

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb / back */}
        <Link
          href="/vehicles"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft size={16} />
          Back to all vehicles
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT — gallery + details */}
          <div className="lg:col-span-7 xl:col-span-8">
            <VehicleGallery images={vehicle.images} alt={vehicle.name} />

            {/* Header */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-brand/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand">
                  {categoryLabel}
                </span>
                {vehicle.isFeatured && (
                  <span className="flex items-center gap-1 rounded-lg bg-amber-400/15 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400">
                    <Crown size={12} />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-text-heading sm:text-4xl">
                {vehicle.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 font-bold text-warning">
                  <Star className="h-4 w-4 fill-current" />
                  {vehicle.rating.toFixed(1)}
                  <span className="font-normal text-text-muted">
                    ({vehicle.reviews} reviews)
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <MapPin size={15} className="text-brand" />
                  {vehicle.location}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-black text-text-heading">
                About this vehicle
              </h2>
              <p className="mt-3 whitespace-pre-line text-pretty leading-relaxed text-text-muted">
                {vehicle.description || "No description provided."}
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Highlight
                icon={<ShieldCheck size={20} />}
                title="Fully Insured"
                subtitle="Comprehensive cover included"
              />
              <Highlight
                icon={<Gauge size={20} />}
                title="Inspected"
                subtitle="50-point safety check"
              />
              <Highlight
                icon={<MapPin size={20} />}
                title={vehicle.location}
                subtitle="Pick-up location"
              />
            </div>
          </div>

          {/* RIGHT — sticky booking widget */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24">
              <BookingWidget vehicle={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-bg-surface p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold text-text-heading">{title}</p>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function VehicleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-bg-elevated" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-bg-elevated" />
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-bg-elevated"
                />
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <div className="h-8 w-2/3 animate-pulse rounded bg-bg-elevated" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-bg-elevated" />
              <div className="mt-6 h-4 w-full animate-pulse rounded bg-bg-elevated" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-bg-elevated" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-bg-elevated" />
            </div>
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="h-96 animate-pulse rounded-2xl bg-bg-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}
