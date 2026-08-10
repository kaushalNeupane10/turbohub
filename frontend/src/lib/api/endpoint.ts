export const API_ENDPOINTS = {
  // Private — requires authentication
  VEHICLES: "/api/vehicles/",

  // Public — no authentication required
  PUBLIC_VEHICLES: "/api/vehicles/public/",
  FEATURED_VEHICLES: "/api/vehicles/public/featured/",
  TOP_RENTED_VEHICLES: "/api/vehicles/public/top-rented/",

  // Bookings — requires authentication
  BOOKINGS: "/api/bookings/",

  // Payments — requires authentication
  PAYMENTS: "/api/payments/",
} as const;
