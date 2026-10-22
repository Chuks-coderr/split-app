"use client";

import { useMemo } from "react";
import {
  getDeadLettered,
  getDeliveryHistory,
} from "@/lib/webhookDeliveryQueue";

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export default function WebhookHealthDashboard() {
  const history = getDeliveryHistory();
  const deadLettered = getDeadLettered();

  const summary = useMemo(() => {
    const successCount = history.filter((entry) => entry.status === "success").length;
    const failedCount = history.filter((entry) => entry.status === "failed").length;
    const recent = history.slice(0, 5);

    return {
      successCount,
      failedCount,
      deadLetteredCount: deadLettered.length,
      recent,
    };
  }, [history, deadLettered]);

  return (
    <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Webhook health</p>
          <h2 className="text-xl font-semibold">Delivery status overview</h2>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            summary.failedCount === 0
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-amber-500/20 text-amber-300"
          }`}
        >
          {summary.failedCount === 0 ? "Healthy" : "Needs attention"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
          <p className="text-xs text-slate-400">Successful sends</p>
          <p className="mt-2 text-2xl font-semibold">{summary.successCount}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
          <p className="text-xs text-slate-400">Failed sends</p>
          <p className="mt-2 text-2xl font-semibold">{summary.failedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
          <p className="text-xs text-slate-400">Dead letters</p>
          <p className="mt-2 text-2xl font-semibold">{summary.deadLetteredCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Recent delivery history</h3>

        {summary.recent.length === 0 ? (
          <p className="text-sm text-slate-400">No webhook events yet.</p>
        ) : (
          <div className="space-y-2">
            {summary.recent.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-100">{entry.url}</p>
                  <p className="text-xs text-slate-400">
                    {formatTimestamp(entry.sentAt)} · {entry.isReplay ? "replay" : "delivery"}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    entry.status === "success"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {deadLettered.length > 0 && (
        <div className="rounded-lg border border-red-700 bg-red-950/40 p-3">
          <h3 className="mb-2 text-sm font-semibold text-red-200">Dead-letter queue</h3>
          <div className="space-y-2">
            {deadLettered.slice(0, 3).map((entry) => (
              <div key={entry.id} className="rounded border border-red-900 bg-red-950/40 p-2 text-sm text-red-100">
                <p className="font-medium">{entry.url}</p>
                <p className="text-xs text-red-200/80">{entry.lastError}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}