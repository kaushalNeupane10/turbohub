"use client";

import {
  Clock,
  CheckCircle2,
  Truck,
  CornerDownLeft,
  XCircle,
} from "lucide-react";
import { BookingStatus } from "@/types/booking.types";

// ── Timeline step config ──────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  {
    key: "pending",
    label: "Request Submitted",
    icon: Clock,
    desc: "Your booking request has been submitted",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    desc: "Owner approved your booking — payment required",
  },
  {
    key: "confirmed",
    label: "Vehicle Picked Up",
    icon: Truck,
    desc: "You collected the vehicle — enjoy your trip!",
  },
  {
    key: "completed",
    label: "Trip Completed",
    icon: CornerDownLeft,
    desc: "Vehicle returned — trip successfully completed",
  },
] as const;

const STATUS_ORDER: BookingStatus[] = [
  "pending",
  "approved",
  "confirmed",
  "completed",
];

interface BookingTimelineProps {
  status: BookingStatus;
}

export default function BookingTimeline({ status }: BookingTimelineProps) {
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-error bg-error/10 text-error">
          <XCircle size={14} />
        </div>
        <div>
          <p className="text-sm font-semibold text-error">Booking Cancelled</p>
          <p className="mt-0.5 text-xs text-text-muted">
            This booking has been cancelled. Any paid amounts will be refunded
            within 5–7 business days.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-0">
      {TIMELINE_STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isPending = idx > currentIdx;

        return (
          <div key={step.key} className="flex gap-3">
            {/* Connector column */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isDone
                    ? "border-success bg-success/10 text-success"
                    : isCurrent
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border-subtle bg-bg-surface text-text-muted/30",
                ].join(" ")}
              >
                {isDone ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Icon size={14} />
                )}
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className={[
                    "w-0.5 flex-1 my-1 min-h-[24px] rounded-full transition-colors duration-300",
                    isDone ? "bg-success/50" : "bg-border-subtle",
                  ].join(" ")}
                />
              )}
            </div>

            {/* Content column */}
            <div className="pb-5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className={[
                    "text-sm font-semibold",
                    isCurrent
                      ? "text-brand"
                      : isDone
                        ? "text-success"
                        : "text-text-muted/40",
                  ].join(" ")}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                    Current
                  </span>
                )}
                {isDone && (
                  <span className="inline-flex items-center rounded-full border border-success/20 bg-success/5 px-2 py-0.5 text-[10px] font-bold text-success uppercase tracking-wider">
                    Done
                  </span>
                )}
              </div>
              <p
                className={[
                  "mt-0.5 text-xs leading-relaxed",
                  isPending ? "text-text-muted/40" : "text-text-muted",
                ].join(" ")}
              >
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
