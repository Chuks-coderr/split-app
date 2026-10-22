"use client";

import { useEffect, useState } from "react";

<<<<<<< HEAD
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
=======
type QueueStatus = {
  pending: number;
  retrying: boolean;
};

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({
    pending: 0,
    retrying: false,
  });
>>>>>>> upstream/main

  useEffect(() => {
    setOffline(!navigator.onLine);
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

<<<<<<< HEAD
  if (!offline) return null;
=======
  useEffect(() => {
    const handleQueueStatus = (event: Event) => {
      const detail = (event as CustomEvent<Partial<QueueStatus>>).detail;
      if (!detail) return;
      setQueueStatus((prev) => ({
        pending:
          typeof detail.pending === "number" ? detail.pending : prev.pending,
        retrying:
          typeof detail.retrying === "boolean"
            ? detail.retrying
            : prev.retrying,
      }));
    };

    window.addEventListener("offline-queue-status", handleQueueStatus);
    return () => {
      window.removeEventListener("offline-queue-status", handleQueueStatus);
    };
  }, []);

  const hasQueue = queueStatus.pending > 0;

  if (!offline && !hasQueue) return null;

  const queueMessage = hasQueue
    ? `${queueStatus.pending} transaction${
        queueStatus.pending === 1 ? "" : "s"
      } queued${queueStatus.retrying ? " — retrying…" : ""}.`
    : null;
>>>>>>> upstream/main

  return (
    <div
      role="alert"
      aria-live="assertive"
<<<<<<< HEAD
      className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-950 text-sm font-medium text-center py-2 px-4"
    >
      You are offline. Some features may not be available.
    </div>
  );
}
=======
      className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-950 text-sm font-medium text-center py-2 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
    >
      {offline && (
        <span>You are offline. Some features may not be available.</span>
      )}
      {queueMessage && <span>{queueMessage}</span>}
      {hasQueue && (
        <a
          href="/offline-queue"
          className="underline font-semibold hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-950 rounded"
        >
          Manage queue
        </a>
      )}
    </div>
  );
}
>>>>>>> upstream/main
