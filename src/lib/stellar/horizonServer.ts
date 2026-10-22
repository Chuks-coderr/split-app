/**
 * Server-only invoice fetching, shared by the RSC invoice list page and
 * `/api/invoices`. Runs the same scan/filter logic either as a direct
 * function call from a Server Component (no HTTP round trip) or from the
 * route handler (for the client-side infinite-scroll dashboard).
 */
import { splitClient } from "@/lib/stellar";
<<<<<<< HEAD
=======
import { blockchainCache } from "@/lib/blockchainCache";
>>>>>>> upstream/main
import type { Invoice } from "@stellar-split/sdk";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export interface FetchInvoicesOptions {
  cursor?: string | null;
  limit?: number;
  /** Case-insensitive prefix match against title/memo. */
  q?: string;
}

export interface FetchInvoicesResult {
  invoices: Invoice[];
  nextCursor: string | null;
}

/**
 * Scans invoice ids starting after `cursor`, returning up to `limit`
 * invoices owned by (created by or a recipient of) `publicKey`.
 */
<<<<<<< HEAD
=======
// Short-lived in-memory cache of fetched invoices, shared across requests
// within this server process. The scan below re-reads the same low-numbered
// invoice ids on every page/filter request, so caching avoids redundant
// on-chain lookups for the common case of a user paging/filtering repeatedly
// within a short window.
const INVOICE_CACHE_TTL_MS = 15_000;
const invoiceCache = new Map<string, { invoice: Invoice | null; expiresAt: number }>();

async function getInvoiceCached(id: string): Promise<Invoice | null> {
  const cached = invoiceCache.get(id);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.invoice;
  }
  let invoice: Invoice | null;
  try {
    invoice = await splitClient.getInvoice(id);
  } catch {
    // splitClient throws when the invoice id does not exist.
    invoice = null;
  }
  invoiceCache.set(id, { invoice, expiresAt: Date.now() + INVOICE_CACHE_TTL_MS });
  return invoice;
}

const SCAN_BATCH_SIZE = 10;

/**
 * Scans invoice ids starting after `cursor`, returning up to `limit`
 * invoices owned by (created by or a recipient of) `publicKey`.
 *
 * Ids are fetched in parallel batches (instead of one at a time) to cut
 * wall-clock latency, with recently-seen invoices served from a short-lived
 * cache. Scanning stops as soon as a batch contains a non-existent id,
 * which marks the end of the list.
 */
>>>>>>> upstream/main
export async function fetchInvoicesForAddress(
  publicKey: string,
  { cursor, limit: limitParam, q: qParam }: FetchInvoicesOptions = {}
): Promise<FetchInvoicesResult> {
<<<<<<< HEAD
  const limit = Math.min(Math.max(1, limitParam ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const q = (qParam ?? "").trim().toLowerCase();
  const startId = cursor ? parseInt(cursor, 10) + 1 : 1;

  const results: Invoice[] = [];

  for (let id = startId; results.length < limit; id++) {
    if (id > startId + limit * 10) break;

    try {
      const inv = await splitClient.getInvoice(String(id));
      const mine =
        inv.creator === publicKey || inv.recipients.some((r) => r.address === publicKey);

=======
  const startTime = performance.now();
  const limit = Math.min(Math.max(1, limitParam ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const q = (qParam ?? "").trim().toLowerCase();
  const startId = cursor ? parseInt(cursor, 10) + 1 : 1;
  const maxScanId = startId + limit * 10;

  const results: Invoice[] = [];
  let reachedEnd = false;
  let scannedCount = 0;

  for (let batchStart = startId; results.length < limit && batchStart <= maxScanId; batchStart += SCAN_BATCH_SIZE) {
    const batchIds = Array.from(
      { length: SCAN_BATCH_SIZE },
      (_, i) => batchStart + i
    ).filter((id) => id <= maxScanId);
    if (batchIds.length === 0) break;

    const batchInvoices = await Promise.all(batchIds.map((id) => getInvoiceCached(String(id))));
    scannedCount += batchIds.length;

    for (const inv of batchInvoices) {
      if (inv === null) {
        reachedEnd = true;
        break;
      }

      const mine =
        inv.creator === publicKey || inv.recipients.some((r) => r.address === publicKey);
>>>>>>> upstream/main
      if (mine) {
        if (q) {
          const invExt = inv as { title?: string; memo?: string };
          const matchesQuery =
            (invExt.title || "").toLowerCase().startsWith(q) || (invExt.memo || "").toLowerCase().startsWith(q);
          if (matchesQuery) results.push(inv);
        } else {
          results.push(inv);
        }
      }
<<<<<<< HEAD
    } catch {
      // splitClient throws when the invoice id does not exist — end of list.
      return { invoices: results, nextCursor: null };
    }
  }

  const nextCursor = results.length === limit ? String(results[results.length - 1].id) : null;
=======
    }

    if (reachedEnd) break;
  }

  const nextCursor = !reachedEnd && results.length === limit
    ? String(results[results.length - 1].id)
    : null;

  const durationMs = performance.now() - startTime;
  if (durationMs > 500) {
    console.warn(
      `[invoices] slow scan: ${durationMs.toFixed(0)}ms, scanned ${scannedCount} ids, returned ${results.length}`
    );
  }

>>>>>>> upstream/main
  return { invoices: results, nextCursor };
}
