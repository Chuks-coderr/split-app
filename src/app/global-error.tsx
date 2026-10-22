"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

<<<<<<< HEAD
=======
import {
  classifyError,
  getErrorTemplate,
  logError,
} from "@/lib/errors";

>>>>>>> upstream/main
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
<<<<<<< HEAD
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
=======
  const errorType = classifyError(error);
  const template = getErrorTemplate(errorType);

  useEffect(() => {
    Sentry.captureException(error);
    logError(error, {
      boundary: "global-error",
      errorType,
      digest: error.digest,
    });
  }, [error, errorType]);
>>>>>>> upstream/main

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#030712" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}>
<<<<<<< HEAD
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
              An unexpected error occurred. Our team has been notified.
            </p>
=======
          <div style={{ textAlign: "center", padding: "2rem", maxWidth: "32rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              {template.title}
            </h2>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
              {template.message}
            </p>
            {template.suggestions.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.5rem",
                  color: "#9ca3af",
                  fontSize: "0.875rem",
                  textAlign: "left",
                }}
              >
                {template.suggestions.map((suggestion) => (
                  <li key={suggestion} style={{ marginBottom: "0.5rem" }}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
>>>>>>> upstream/main
            <button
              onClick={reset}
              style={{
                padding: "0.5rem 1.25rem",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
<<<<<<< HEAD
              Try again
            </button>
=======
              {template.recoveryLabel}
            </button>
            {error.digest && (
              <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "1rem" }}>
                Reference: {error.digest}
              </p>
            )}
>>>>>>> upstream/main
          </div>
        </div>
      </body>
    </html>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> upstream/main
