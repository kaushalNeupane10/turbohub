import React from "react";

export default function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-bg-sunken">
            <th className="px-6 py-4"><div className="h-4 w-20 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" /></th>
            <th className="px-6 py-4"><div className="h-4 w-16 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" /></th>
            <th className="px-6 py-4"><div className="h-4 w-24 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" /></th>
            <th className="px-6 py-4"><div className="h-4 w-20 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" /></th>
            <th className="px-6 py-4"><div className="h-4 w-16 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" /></th>
            <th className="px-6 py-4 text-right"><div className="ml-auto h-4 w-16 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-border-subtle">
              {/* Vehicle Detail Cell */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-16 bg-neutral-300 dark:bg-neutral-700 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
                  </div>
                </div>
              </td>
              {/* Category */}
              <td className="px-6 py-4">
                <div className="h-6 w-16 bg-neutral-300 dark:bg-neutral-700 rounded-lg animate-pulse" />
              </td>
              {/* Price */}
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
              </td>
              {/* Location */}
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
              </td>
              {/* Status */}
              <td className="px-6 py-4">
                <div className="h-6 w-20 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-pulse" />
              </td>
              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="ml-auto flex items-center justify-end gap-2">
                  <div className="h-9 w-9 bg-neutral-300 dark:bg-neutral-700 rounded-lg animate-pulse" />
                  <div className="h-9 w-9 bg-neutral-300 dark:bg-neutral-700 rounded-lg animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
