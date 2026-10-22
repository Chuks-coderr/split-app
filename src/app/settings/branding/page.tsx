<<<<<<< HEAD
import type { Metadata } from "next";
import BrandingForm from "@/components/settings/BrandingForm";

export const metadata: Metadata = {
  title: "Branding — StellarSplit Settings",
  robots: { index: false, follow: false },
};
=======
"use client";

import InvoiceBrandingSettings from "@/components/InvoiceBrandingSettings";
>>>>>>> upstream/main

export default function BrandingSettingsPage() {
  return (
    <main className="max-w-xl mx-auto w-full px-4 sm:px-6 py-16">
<<<<<<< HEAD
      <h1 className="text-3xl font-bold mb-2">Branding</h1>
      <p className="text-sm text-gray-400 mb-8">
        Upload your company logo, pick an accent color, and write a tagline.
        They are rendered on every invoice you create — both the live invoice
        page and the PDF export — and are scoped to your Stellar account.
      </p>
      <BrandingForm />
=======
      <h1 className="text-3xl font-bold mb-2">Invoice branding</h1>
      <p className="text-sm text-gray-500 mb-8">
        Customize how your invoices look with a logo, accent color, font and watermark.
        These preferences apply to invoice previews and exported PDFs.
      </p>
      <InvoiceBrandingSettings />
>>>>>>> upstream/main
    </main>
  );
}
