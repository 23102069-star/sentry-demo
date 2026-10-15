 "use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function DemoControls() {
  const [result, setResult] = useState("");

  async function callApi(path: string) {
    setResult(`Calling ${path}…`);
    try {
      const response = await fetch(path);
      const body = await response.text();
      setResult(`${path} returned HTTP ${response.status}: ${body}`);
    } catch (error) {
      setResult(`Request failed: ${String(error)}`);
    }
  }

  return (
    <>
      <div className="actions">
        <button
          className="primary"
          onClick={() => {
            throw new Error("Sentry demo: uncaught frontend error");
          }}
        >
          Throw frontend error
        </button>
        <button
          onClick={() => {
            try {
              throw new Error("Sentry demo: handled frontend error");
            } catch (error) {
              Sentry.withScope((scope) => {
                scope.setTag("demo_error_type", "handled_frontend");
                Sentry.captureException(error);
              });
              setResult("Handled error captured (if a DSN is configured).");
            }
          }}
        >
          Handled error
        </button>
        <button onClick={() => void callApi("/api/error")}>
          Call /api/error
        </button>
        <button
          onClick={() => {
            void Promise.reject(
              new Error("Sentry demo: unhandled promise rejection"),
            );
          }}
        >
          Unhandled promise rejection
        </button>
        <button onClick={() => void callApi("/api/handled-error")}>
          Call /api/handled-error
        </button>
      </div>
      <p className="result" aria-live="polite">{result}</p>
    </>
  );
}
