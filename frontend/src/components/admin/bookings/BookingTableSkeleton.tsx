"use client";

export default function BookingTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto animate-pulse">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-bg-sunken">
            {["Renter", "Vehicle", "Dates", "Total", "Status", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-text-muted"
                >
                  {col}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-border-subtle">
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b border-border-subtle">
              {/* Renter */}
              <td className="px-5 py-4">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-28 rounded-full bg-skeleton" />
                  <div className="h-3 w-36 rounded-full bg-skeleton" />
                </div>
              </td>

              {/* Vehicle */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 rounded-lg bg-skeleton shrink-0" />
                  <div className="h-3.5 w-24 rounded-full bg-skeleton" />
                </div>
              </td>

              {/* Dates */}
              <td className="px-5 py-4">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-24 rounded-full bg-skeleton" />
                  <div className="h-3 w-24 rounded-full bg-skeleton" />
                </div>
              </td>

              {/* Total */}
              <td className="px-5 py-4">
                <div className="h-3.5 w-20 rounded-full bg-skeleton" />
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <div className="h-6 w-20 rounded-full bg-skeleton" />
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded-lg bg-skeleton" />
                  <div className="h-8 w-8 rounded-lg bg-skeleton" />
                  <div className="h-8 w-8 rounded-lg bg-skeleton" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
