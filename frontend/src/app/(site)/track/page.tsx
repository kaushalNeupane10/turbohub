import { Metadata } from "next";
import PublicBookingTracker from "@/components/user/bookings/PublicBookingTracker";

export const metadata: Metadata = {
  title: "Track Booking | Turbo Hub",
  description:
    "Track your vehicle rental booking status instantly without login. Enter your Booking ID to view live progress, vehicle details, and payment updates.",
};

export default function TrackBookingPage() {
  return (
    <div className="min-h-screen bg-bg-page py-10 sm:py-14">
      <div className="container-main">
        <PublicBookingTracker />
      </div>
    </div>
  );
}
