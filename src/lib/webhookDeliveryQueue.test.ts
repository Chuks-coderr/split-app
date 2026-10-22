import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDeliveryHistoryEntry,
  enqueue,
  getDeadLettered,
  getDeliveryHistory,
  processQueue,
} from "./webhookDeliveryQueue";

describe("webhookDeliveryQueue", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("queues and processes a successful delivery", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      }),
    );

    const item = enqueue({ event: "invoice_paid", amount: 250 }, "https://example.com/hook");
    expect(item.id).toBeTruthy();

    await processQueue();

    expect(getDeliveryHistory()).toHaveLength(1);
    expect(getDeliveryHistory()[0].status).toBe("success");
    expect(getDeadLettered()).toHaveLength(0);
  });

  it("moves failed deliveries to the dead-letter queue after repeated attempts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    const item = enqueue({ event: "invoice_failed" }, "https://example.com/hook");
    expect(item.retryCount).toBe(0);

    await processQueue();
    await processQueue();
    await processQueue();
    await processQueue();

    expect(getDeadLettered().length).toBeGreaterThan(0);
  });

  it("stores a history record for replay attempts", () => {
    const entry = addDeliveryHistoryEntry({
      url: "https://example.com/hook",
      payload: { event: "invoice_created" },
      sentAt: Date.now(),
      status: "success",
      isReplay: false,
    });

    expect(entry.id).toBeTruthy();
    expect(getDeliveryHistory()[0].payload).toEqual({ event: "invoice_created" });
  });
});