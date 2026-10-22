"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { splitClient } from "@/lib/stellar";

interface Props {
  address: string;
}

export default function ReputationBadge({ address }: Props) {
  const [reputation, setReputation] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        // Mock reputation (in real app, would call splitClient.getReputation)
        const rep = Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : 0;
        setReputation(rep);
      } catch {
        setReputation(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, [address]);

  if (loading) {
=======
import { useCreatorReputation } from "@/hooks/useCreatorReputation";
import type { CreatorReputationResult } from "@/lib/reputation";

interface Props {
  address: string;
  reputation?: CreatorReputationResult;
}

export default function ReputationBadge({ address, reputation }: Props) {
  const { data: fetchedReputation, loading } = useCreatorReputation(address);
  const result = reputation ?? fetchedReputation;

  if (loading && !result) {
>>>>>>> upstream/main
    return (
      <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-400">
        ⏳
      </span>
    );
  }

<<<<<<< HEAD
  const isVerified = reputation !== null && reputation > 0;
=======
  const score = result?.score ?? null;
  const isUnrated = score === null;
  const grade = result?.grade ?? null;
  const tier = result?.tier ?? null;
>>>>>>> upstream/main

  const tooltipText =
    "Reputation is calculated from on-time payments, dispute win rate, " +
    "and total transaction volume. Consistent, timely activity raises your score.";

<<<<<<< HEAD
=======
  const badgeLabel = isUnrated
    ? "Unrated"
    : `${score}${grade ? ` · ${grade}` : ""}${tier ? ` · ${tier}` : ""}`;

  const ariaLabel = isUnrated
    ? `Reputation: unrated. ${tooltipText}`
    : `Reputation: ${score}${grade ? `, grade ${grade}` : ""}${
        tier ? `, ${tier} tier` : ""
      }. ${tooltipText}`;

>>>>>>> upstream/main
  return (
    <span className="group relative inline-flex">
      <span
        tabIndex={0}
        role="img"
<<<<<<< HEAD
        aria-label={`Reputation: ${reputation ?? 0}. ${tooltipText}`}
        className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isVerified
            ? "bg-green-900 text-green-300"
            : "bg-gray-700 text-gray-400"
        }`}
      >
        {isVerified ? "✓" : "○"}
=======
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isUnrated
            ? "bg-gray-700 text-gray-400"
            : "bg-green-900 text-green-300"
        }`}
      >
        {isUnrated ? "○" : "✓"}
        <span>{badgeLabel}</span>
>>>>>>> upstream/main
      </span>
      {/* Tooltip: shown on hover and keyboard focus */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden w-56 rounded bg-gray-900 border border-gray-700 px-2 py-1.5 text-xs text-gray-200 shadow-lg group-hover:block group-focus-within:block"
      >
        <span className="block font-semibold mb-0.5">
<<<<<<< HEAD
          Reputation: {reputation ?? 0}
        </span>
=======
          {isUnrated ? "Reputation: Unrated" : `Reputation: ${score}`}
        </span>
        {!isUnrated && (grade || tier) && (
          <span className="block mb-0.5">
            {grade ? `Grade: ${grade}` : ""}
            {grade && tier ? " · " : ""}
            {tier ? `Tier: ${tier}` : ""}
          </span>
        )}
>>>>>>> upstream/main
        {tooltipText}
      </span>
    </span>
  );
}
