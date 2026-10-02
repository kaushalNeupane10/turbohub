import React from "react";

/**
 * TableSkeleton — polished loading state for the Vehicle Management table.
 * Uses the design-system `skeleton` CSS variable for consistent theming in
 * both light and dark mode (no raw Tailwind color classes).
 */

const SkeletonBox = ({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{ backgroundColor: "var(--skeleton)", ...style }}
  />
);

export default function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        {/* Header */}
        <thead>
          <tr className="border-b border-border-subtle bg-bg-sunken">
            <th className="px-6 py-4">
              <SkeletonBox className="h-3.5 w-20" />
            </th>
            <th className="px-6 py-4">
              <SkeletonBox className="h-3.5 w-14" />
            </th>
            <th className="px-6 py-4">
              <SkeletonBox className="h-3.5 w-24" />
            </th>
            <th className="px-6 py-4">
              <SkeletonBox className="h-3.5 w-16" />
            </th>
            <th className="px-6 py-4">
              <SkeletonBox className="h-3.5 w-14" />
            </th>
            <th className="px-6 py-4 text-right">
              <SkeletonBox className="ml-auto h-3.5 w-16" />
            </th>
          </tr>
        </thead>

        {/* Body rows */}
        <tbody className="divide-y divide-border-subtle">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-border-subtle">
              {/* Vehicle cell */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <SkeletonBox
                    className="h-12 w-16 shrink-0 rounded-lg"
                    style={{ opacity: 0.7 + i * 0.06 }}
                  />
                  {/* Name + tagline */}
                  <div className="flex flex-col gap-2">
                    <SkeletonBox className="h-4 w-32" />
                    <SkeletonBox className="h-3 w-44 opacity-60" />
                  </div>
                </div>
              </td>

              {/* Type badge */}
              <td className="px-6 py-4">
                <SkeletonBox className="h-6 w-16 rounded-lg" />
              </td>

              {/* Price */}
              <td className="px-6 py-4">
                <SkeletonBox className="h-4 w-20" />
              </td>

              {/* Location */}
              <td className="px-6 py-4">
                <SkeletonBox className="h-4 w-24" />
              </td>

              {/* Status pill */}
              <td className="px-6 py-4">
                <SkeletonBox className="h-6 w-20 rounded-full" />
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <SkeletonBox className="h-9 w-9 rounded-lg" />
                  <SkeletonBox className="h-9 w-9 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
