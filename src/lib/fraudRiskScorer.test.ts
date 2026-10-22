import type { Invoice } from "@stellar-split/sdk";
import { AnomalyType, type AnomalyFlag } from "./anomalyDetector";

export type RiskTier = "low" | "medium" | "high";

export interface SignalContribution {
  signal: string;
  weight: number;
  contribution: number;
  description: string;
}

export interface RiskFactor {
  name: string;
  weight: number;
  value: number;
}

export interface FraudRiskScore {
  score: number;
  tier: RiskTier;
  signals: SignalContribution[];
  timestamp: number;
  factors?: RiskFactor[];
}

export interface FraudRiskScoreOptions {
  explain?: boolean;
}

const WEIGHTS = {
  RAPID_SUCCESSION: 35,
  FIRST_TIME_LARGE: 40,
  LARGE_AMOUNT: 15,
  UNUSUAL_PATTERN: 10,
};

const TIER_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 70,
};

export function calculateFraudRiskScore(
  invoice: Invoice,
  anomalyFlags: AnomalyFlag[],
  payerHistory: Map<string, number> = new Map(),
  options: FraudRiskScoreOptions = {},
): FraudRiskScore {
  const signals: SignalContribution[] = [];
  const factors: RiskFactor[] = [];
  let totalScore = 0;

  const rapidCount = anomalyFlags.filter((f) => f.type === AnomalyType.RAPID_SUCCESSION).length;
  if (rapidCount > 0) {
    const contribution = Math.min(rapidCount * WEIGHTS.RAPID_SUCCESSION, WEIGHTS.RAPID_SUCCESSION);
    signals.push({
      signal: "rapid_succession",
      weight: WEIGHTS.RAPID_SUCCESSION,
      contribution,
      description: `${rapidCount} rapid payment${rapidCount > 1 ? "s" : ""} detected`,
    });
    factors.push({
      name: "rapid_succession",
      weight: contribution,
      value: rapidCount,
    });
    totalScore += contribution;
  }

  const firstTimeLargeCount = anomalyFlags.filter((f) => f.type === AnomalyType.FIRST_TIME_LARGE).length;
  if (firstTimeLargeCount > 0) {
    const contribution = Math.min(firstTimeLargeCount * WEIGHTS.FIRST_TIME_LARGE, WEIGHTS.FIRST_TIME_LARGE);
    signals.push({
      signal: "first_time_large",
      weight: WEIGHTS.FIRST_TIME_LARGE,
      contribution,
      description: `${firstTimeLargeCount} new payer${firstTimeLargeCount > 1 ? "s" : ""} with large contribution`,
    });
    factors.push({
      name: "first_time_large",
      weight: contribution,
      value: firstTimeLargeCount,
    });
    totalScore += contribution;
  }

  const invoiceTotal = invoice.recipients.reduce((sum, r) => sum + r.amount, 0n);
  if (invoiceTotal > 1_000_000n) {
    const contribution = Math.min((Number(invoiceTotal) / 1_000_000) * 5, WEIGHTS.LARGE_AMOUNT);
    signals.push({
      signal: "large_amount",
      weight: WEIGHTS.LARGE_AMOUNT,
      contribution,
      description: `Large invoice amount (${(Number(invoiceTotal) / 1e7).toFixed(2)} XLM)`,
    });
    factors.push({
      name: "large_amount",
      weight: contribution,
      value: Number(invoiceTotal),
    });
    totalScore += contribution;
  }

  const hasUnusualRecipients = invoice.recipients.length > 10;
  if (hasUnusualRecipients) {
    const contribution = WEIGHTS.UNUSUAL_PATTERN;
    signals.push({
      signal: "unusual_pattern",
      weight: WEIGHTS.UNUSUAL_PATTERN,
      contribution,
      description: `High recipient count (${invoice.recipients.length} recipients)`,
    });
    factors.push({
      name: "unusual_pattern",
      weight: contribution,
      value: invoice.recipients.length,
    });
    totalScore += contribution;
  }

  const maxPossibleScore = Object.values(WEIGHTS).reduce((sum, w) => sum + w, 0);
  const normalizedScore = Math.min(100, (totalScore / maxPossibleScore) * 100);

  const result: FraudRiskScore = {
    score: Math.round(normalizedScore),
    tier: getTierFromScore(normalizedScore),
    signals,
    timestamp: Date.now(),
  };

  if (options.explain) {
    result.factors = factors.sort((a, b) => b.weight - a.weight);
  }

  return result;
}

function getTierFromScore(score: number): RiskTier {
  if (score < TIER_THRESHOLDS.LOW) return "low";
  if (score < TIER_THRESHOLDS.MEDIUM) return "medium";
  return "high";
}

export function formatRiskScore(score: FraudRiskScore): {
  scoreDisplay: string;
  tierLabel: string;
  tierColor: string;
  isHighRisk: boolean;
} {
  const tierColors: Record<RiskTier, string> = {
    low: "text-green-600",
    medium: "text-amber-600",
    high: "text-red-600",
  };

  const tierLabels: Record<RiskTier, string> = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  };

  return {
    scoreDisplay: `${score.score}/100`,
    tierLabel: tierLabels[score.tier],
    tierColor: tierColors[score.tier],
    isHighRisk: score.tier === "high",
  };
}