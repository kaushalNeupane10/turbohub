import { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import UserBookingsList from "@/components/user/bookings/UserBookingsList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "My Bookings | Turbo Hub",
  description:
    "Track all your vehicle rental bookings — view status, payment details, booking timelines, and more on Turbo Hub.",
};

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-page">
        <div className="container-main py-10 sm:py-14">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                <CalendarDays size={20} className="text-brand" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-text-heading sm:text-3xl">
                  My Bookings
                </h1>
                <p className="text-sm text-text-muted mt-0.5">
                  Track and manage all your rental bookings
                </p>
              </div>
            </div>
          </div>

          {/* Bookings list */}
          <UserBookingsList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
