import { PublicVehicleApiResponse } from "@/types/vehicle.types";
import { Vehicle } from "@/types/vehicle_card.types";

/**
 * Maps a raw PublicVehicleApiResponse (from the public API) into the
 * normalised Vehicle shape consumed by VehicleCard and other UI components.
 *
 * This keeps API shape changes isolated to one file rather than scattered
 * across every component that renders a vehicle.
 */
export function mapPublicVehicleToCard(v: PublicVehicleApiResponse): Vehicle {
  // Order images cover-first, then by their `order` field.
  const sortedImages = [...v.images].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    return a.order - b.order;
  });
  const coverImage = sortedImages[0] ?? null;

  return {
    id: String(v.id),
    name: v.name,
    description: v.description,
    image: coverImage?.url ?? "",
    images: sortedImages.map((img) => img.url),
    category: v.vehicle_type,
    badge: v.badge || v.vehicle_type.toUpperCase(),
    tagline: v.tagline || v.location,
    location: v.location,
    rating: parseFloat(v.rating) || 0,
    reviews: v.review_count,
    pricePerDay: parseFloat(v.price_per_day),
    available: v.status === "available",
    isFeatured: v.is_featured,
    bookingCountThisWeek: v.booking_count_this_week ?? undefined,
    features: [],
  };
}
