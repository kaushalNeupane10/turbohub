"use client";

import { useSearchParams } from "next/navigation";

/**
 * Displays the Stripe checkout session id in small print (support reference).
 * Uses useSearchParams, so it must be a client component rendered inside a
 * Suspense boundary on the server page.
 */
export function SessionNoteClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) return null;

  return (
    <p className="mt-4 break-all rounded-lg bg-bg-elevated px-3 py-2 text-xs text-text-muted">
      Reference: {sessionId}
    </p>
  );
}
