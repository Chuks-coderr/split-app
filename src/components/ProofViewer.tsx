"use client";

import { useRef, useState } from "react";
import { splitClient } from "@/lib/stellar";
import { formatAmount, truncateAddress } from "@stellar-split/sdk";
<<<<<<< HEAD
=======
import { getIpfsUrl, isValidCid } from "@/lib/ipfs";
>>>>>>> upstream/main

interface VerifiedProof {
  payer: string;
  amount: bigint;
  ledger: number;
  imageUrl?: string;
}

<<<<<<< HEAD
interface Props {
  invoiceId: string;
=======
type ViewerMode = "payment" | "evidence";

interface Props {
  invoiceId: string;
  mode?: ViewerMode;
>>>>>>> upstream/main
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

<<<<<<< HEAD
export default function ProofViewer({ invoiceId }: Props) {
  const [proofHash, setProofHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<VerifiedProof | null>(null);
=======
export default function ProofViewer({ invoiceId, mode = "payment" }: Props) {
  const [proofHash, setProofHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<VerifiedProof | null>(null);
  const [evidenceCid, setEvidenceCid] = useState<string | null>(null);
>>>>>>> upstream/main
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleVerify = async () => {
    if (!proofHash.trim()) return;
    setError(null);
    setVerifying(true);

    try {
<<<<<<< HEAD
=======
      if (mode === "evidence") {
        const cid = proofHash.trim();
        if (!isValidCid(cid)) {
          setError("Invalid evidence CID. Please provide a valid IPFS CID.");
          return;
        }
        setEvidenceCid(cid);
        return;
      }

>>>>>>> upstream/main
      // In a real implementation, this would call splitClient.generatePaymentProof
      // and compare against the proof hash. For now, we'll simulate the verification.
      const proof = await (splitClient as any).generatePaymentProof(proofHash);
      
      if (proof && proof.proofHash === proofHash) {
        setVerified({
          payer: proof.payer,
          amount: proof.amount,
          ledger: proof.ledger,
        });
      } else {
        setError("Proof verification failed. Invalid or expired proof hash.");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setVerifying(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Verify Payment Proof</h3>

      {!verified ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="proof-hash" className="block text-sm font-medium text-gray-300 mb-2">
              Proof Hash
=======
  const resetViewer = () => {
    setVerified(null);
    setEvidenceCid(null);
    setProofHash("");
    setError(null);
    resetZoom();
  };

  const isEvidence = mode === "evidence";
  const evidenceUrl = evidenceCid ? getIpfsUrl(evidenceCid) : null;
  const evidenceIsPdf = evidenceCid ? /\.pdf$/i.test(evidenceCid) : false;
  const showViewer = isEvidence ? Boolean(evidenceCid) : Boolean(verified);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEvidence ? "View Evidence" : "Verify Payment Proof"}
      </h3>

      {!showViewer ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="proof-hash" className="block text-sm font-medium text-gray-300 mb-2">
              {isEvidence ? "Evidence CID" : "Proof Hash"}
>>>>>>> upstream/main
            </label>
            <input
              id="proof-hash"
              type="text"
              value={proofHash}
              onChange={(e) => setProofHash(e.target.value)}
<<<<<<< HEAD
              placeholder="Paste proof hash here..."
=======
              placeholder={
                isEvidence ? "Paste IPFS CID here..." : "Paste proof hash here..."
              }
>>>>>>> upstream/main
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}

          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying || !proofHash.trim()}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium disabled:opacity-50"
          >
<<<<<<< HEAD
            {verifying ? "Verifying…" : "Verify Proof"}
=======
            {verifying
              ? "Verifying…"
              : isEvidence
                ? "Load Evidence"
                : "Verify Proof"}
>>>>>>> upstream/main
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <span className="text-green-400 text-lg">✓</span>
<<<<<<< HEAD
            <span className="text-sm font-medium text-green-300">Proof Verified</span>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">Payer</p>
              <p className="text-sm font-mono text-gray-300">
                {truncateAddress(verified.payer)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-sm font-medium text-gray-300">
                {formatAmount(verified.amount)} USDC
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ledger</p>
              <p className="text-sm text-gray-300">{verified.ledger}</p>
            </div>
          </div>

          {verified.imageUrl && (
=======
            <span className="text-sm font-medium text-green-300">
              {isEvidence ? "Evidence Loaded" : "Proof Verified"}
            </span>
          </div>

          {!isEvidence && verified && (
            <div className="bg-gray-900 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500">Payer</p>
                <p className="text-sm font-mono text-gray-300">
                  {truncateAddress(verified.payer)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium text-gray-300">
                  {formatAmount(verified.amount)} USDC
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ledger</p>
                <p className="text-sm text-gray-300">{verified.ledger}</p>
              </div>
            </div>
          )}

          {isEvidence && evidenceCid && (
            <div className="bg-gray-900 rounded-lg p-4 space-y-1">
              <p className="text-xs text-gray-500">CID</p>
              <p className="text-sm font-mono text-gray-300 break-all">{evidenceCid}</p>
            </div>
          )}

          {isEvidence && evidenceUrl && evidenceIsPdf && (
            <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
              <iframe
                src={evidenceUrl}
                title="Evidence document"
                className="h-96 w-full"
              />
            </div>
          )}

          {isEvidence && evidenceUrl && !evidenceIsPdf && (
            <div className="space-y-2">
              <div
                className="relative h-64 overflow-hidden rounded-lg border border-gray-700 bg-gray-900"
                style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <img
                  src={evidenceUrl}
                  alt="Evidence"
                  draggable={false}
                  className="h-full w-full object-contain select-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {!isEvidence && verified?.imageUrl && (
>>>>>>> upstream/main
            <div className="space-y-2">
              <div
                className="relative h-64 overflow-hidden rounded-lg border border-gray-700 bg-gray-900"
                style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <img
                  src={verified.imageUrl}
                  alt="Payment proof"
                  draggable={false}
                  className="h-full w-full object-contain select-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
<<<<<<< HEAD
            onClick={() => {
              setVerified(null);
              setProofHash("");
              resetZoom();
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700"
          >
            Verify Another
=======
            onClick={resetViewer}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700"
          >
            {isEvidence ? "Load Another" : "Verify Another"}
>>>>>>> upstream/main
          </button>
        </div>
      )}
    </div>
  );
}
