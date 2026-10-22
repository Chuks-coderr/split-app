"use client";

import { useMemo, useState } from "react";

type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

type ReconciliationRecord = {
  period: string;
  account: string;
  currency: CurrencyCode;
  expected: number;
  actual: number;
  fxRateToUsd: number;
  benchmarkRateToUsd: number;
};

type ReconciliationRow = {
  account: string;
  currency: CurrencyCode;
  period: string;
  expected: number;
  actual: number;
  variance: number;
  variancePct: number;
  fxImpact: number;
  fxRateToUsd: number;
  baseExpected: number;
  baseActual: number;
  explanation: string;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

const demoData: ReconciliationRecord[] = [
  {
    period: "Jan 2026",
    account: "North America",
    currency: "USD",
    expected: 320000,
    actual: 314500,
    fxRateToUsd: 1,
    benchmarkRateToUsd: 1,
  },
  {
    period: "Jan 2026",
    account: "EU Ops",
    currency: "EUR",
    expected: 180000,
    actual: 176400,
    fxRateToUsd: 1.08,
    benchmarkRateToUsd: 1.1,
  },
  {
    period: "Jan 2026",
    account: "UK Ledger",
    currency: "GBP",
    expected: 125000,
    actual: 130250,
    fxRateToUsd: 1.27,
    benchmarkRateToUsd: 1.25,
  },
  {
    period: "Feb 2026",
    account: "North America",
    currency: "USD",
    expected: 338000,
    actual: 335500,
    fxRateToUsd: 1,
    benchmarkRateToUsd: 1,
  },
  {
    period: "Feb 2026",
    account: "EU Ops",
    currency: "EUR",
    expected: 192000,
    actual: 190200,
    fxRateToUsd: 1.09,
    benchmarkRateToUsd: 1.08,
  },
  {
    period: "Feb 2026",
    account: "UK Ledger",
    currency: "GBP",
    expected: 132000,
    actual: 137000,
    fxRateToUsd: 1.3,
    benchmarkRateToUsd: 1.27,
  },
  {
    period: "Feb 2026",
    account: "APAC",
    currency: "JPY",
    expected: 9200000,
    actual: 8850000,
    fxRateToUsd: 0.0068,
    benchmarkRateToUsd: 0.0069,
  },
];

function calculateReconciliation(rows: ReconciliationRecord[]): ReconciliationRow[] {
  return rows.map((row) => {
    const baseExpected = row.expected * row.fxRateToUsd;
    const baseActual = row.actual * row.fxRateToUsd;
    const variance = baseActual - baseExpected;
    const variancePct = baseExpected === 0 ? 0 : (variance / baseExpected) * 100;
    const fxImpact = row.actual * (row.fxRateToUsd - row.benchmarkRateToUsd);

    const explanation =
      Math.abs(variance) < 1_000
        ? "Variance is within normal operating tolerance."
        : variance > 0
          ? "Actuals exceeded expectation primarily due to FX movement and volume uplift."
          : "Actuals trailed the plan, with the shortfall amplified by FX headwinds.";

    return {
      account: row.account,
      currency: row.currency,
      period: row.period,
      expected: row.expected,
      actual: row.actual,
      variance,
      variancePct,
      fxImpact,
      fxRateToUsd: row.fxRateToUsd,
      baseExpected,
      baseActual,
      explanation,
    };
  });
}

export default function ReconciliationReport() {
  const [period, setPeriod] = useState<string>("Feb 2026");

  const rows = useMemo(() => calculateReconciliation(demoData), []);

  const currentRows = useMemo(
    () => rows.filter((row) => row.period === period),
    [rows, period]
  );

  const priorRows = useMemo(() => {
    const periods = Array.from(new Set(rows.map((row) => row.period))).sort();
    const idx = periods.indexOf(period);
    const previous = periods[idx - 1] ?? periods[0];
    return rows.filter((row) => row.period === previous);
  }, [rows, period]);

  const totals = useMemo(() => {
    const expected = currentRows.reduce((sum, row) => sum + row.baseExpected, 0);
    const actual = currentRows.reduce((sum, row) => sum + row.baseActual, 0);
    const variance = actual - expected;
    const fxImpact = currentRows.reduce((sum, row) => sum + row.fxImpact, 0);

    return { expected, actual, variance, fxImpact };
  }, [currentRows]);

  const priorTotals = useMemo(() => {
    const expected = priorRows.reduce((sum, row) => sum + row.baseExpected, 0);
    const actual = priorRows.reduce((sum, row) => sum + row.baseActual, 0);
    return { expected, actual, variance: actual - expected };
  }, [priorRows]);

  const variancePct = totals.expected === 0 ? 0 : (totals.variance / totals.expected) * 100;
  const periodDelta = totals.actual - priorTotals.actual;
  const periodDeltaPct =
    priorTotals.actual === 0 ? 0 : (periodDelta / priorTotals.actual) * 100;

  const handleExportCsv = () => {
    const header = [
      "account",
      "currency",
      "period",
      "expected",
      "actual",
      "variance_usd",
      "fx_rate_to_usd",
      "fx_impact_usd",
      "variance_pct",
      "notes",
    ];

    const csvRows = rows.map((row) =>
      [
        row.account,
        row.currency,
        row.period,
        row.expected.toFixed(2),
        row.actual.toFixed(2),
        row.variance.toFixed(2),
        row.fxRateToUsd.toFixed(4),
        row.fxImpact.toFixed(2),
        row.variancePct.toFixed(2),
        `"${row.explanation.replace(/"/g, '""')}"`,
      ].join(",")
    );

    const csv = [header.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-report-${period.toLowerCase().replace(/\\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Reconciliation</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Multi-currency variance report</h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none ring-0"
          >
            {Array.from(new Set(rows.map((row) => row.period))).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-lg border border-indigo-500 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/20"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">Expected</p>
          <p className="mt-2 text-2xl font-bold text-white">{formatUsd(totals.expected)}</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">Actual</p>
          <p className="mt-2 text-2xl font-bold text-white">{formatUsd(totals.actual)}</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">Variance</p>
          <p className={`mt-2 text-2xl font-bold ${totals.variance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatUsd(totals.variance)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">FX impact</p>
          <p className={`mt-2 text-2xl font-bold ${totals.fxImpact >= 0 ? "text-cyan-400" : "text-amber-400"}`}>
            {formatUsd(totals.fxImpact)}
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-sm text-gray-400">Variance vs expectation</p>
          <p className={`mt-2 text-xl font-semibold ${variancePct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {variancePct >= 0 ? "+" : ""}
            {variancePct.toFixed(2)}%
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {totals.variance >= 0
              ? "Actuals are above plan, mostly due to stronger settlement volume and FX gains."
              : "Actuals are below plan, suggesting either lower volume or adverse FX movement."}
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-sm text-gray-400">Period-over-period</p>
          <p className={`mt-2 text-xl font-semibold ${periodDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {periodDelta >= 0 ? "+" : ""}
            {formatUsd(periodDelta)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {periodDeltaPct >= 0 ? "+" : ""}
            {periodDeltaPct.toFixed(2)}% vs prior period
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-800 text-gray-400">
            <tr>
              <th className="py-3 pr-4">Account</th>
              <th className="py-3 pr-4">Currency</th>
              <th className="py-3 pr-4">Expected</th>
              <th className="py-3 pr-4">Actual</th>
              <th className="py-3 pr-4">Variance</th>
              <th className="py-3 pr-4">FX impact</th>
              <th className="py-3 pr-4">Rate</th>
              <th className="py-3 pr-4">Notes</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row) => (
              <tr key={`${row.account}-${row.currency}`} className="border-b border-gray-800/80">
                <td className="py-3 pr-4 font-medium text-white">{row.account}</td>
                <td className="py-3 pr-4 text-gray-300">{row.currency}</td>
                <td className="py-3 pr-4 text-gray-300">{formatCurrency(row.expected, row.currency)}</td>
                <td className="py-3 pr-4 text-gray-300">{formatCurrency(row.actual, row.currency)}</td>
                <td className={`py-3 pr-4 font-medium ${row.variance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatUsd(row.variance)}
                </td>
                <td className={`py-3 pr-4 font-medium ${row.fxImpact >= 0 ? "text-cyan-400" : "text-amber-400"}`}>
                  {formatUsd(row.fxImpact)}
                </td>
                <td className="py-3 pr-4 text-gray-300">
                  {row.fxRateToUsd.toFixed(4)}
                </td>
                <td className="py-3 pr-4 text-gray-400">{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}