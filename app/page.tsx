import DemoControls from "./demo-controls";

export default function HomePage() {
  const dsnConfigured = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

  return (
    <main>
      <section className="panel">
        <h1>Sentry Demo App</h1>
        <p className="intro">
          A minimal test app for sending sample frontend and server errors to
          Sentry. No other monitoring tools are included.
        </p>
        <p className="status" role="status">
          Sentry DSN: <strong>{dsnConfigured ? "configured" : "not configured"}</strong>
          {!dsnConfigured && " — the app still runs, but events will not be sent."}
        </p>
        <DemoControls />
        <p className="hint">
          Error buttons intentionally create failures. Use them only when testing
          this demo.
        </p>
      </section>
    </main>
  );
}
