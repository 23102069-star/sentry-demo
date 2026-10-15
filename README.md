# Sentry Demo App

A minimal Next.js App Router + TypeScript application for testing Sentry error reporting on Vercel Hobby. It does not include Grafana, Datadog, Sentry source-map upload, or any other monitoring integration.

## Requirements

- Node.js 20.9 or newer
- A free Sentry account (optional; the app runs without a DSN)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. On Windows PowerShell, copy the example file with:

```powershell
Copy-Item .env.example .env.local
```

To send events locally, put your Sentry project DSN in `.env.local` as `NEXT_PUBLIC_SENTRY_DSN=...`, then restart the development server. Leave it empty to run without sending events.

## Create a free Sentry project

1. Sign in to [Sentry](https://sentry.io/).
2. Create a project and select **Next.js** as the platform.
3. Copy the project's DSN from its setup/project settings.
4. In Vercel, open your project and go to **Settings → Environment Variables**.
5. Add `NEXT_PUBLIC_SENTRY_DSN` with the copied DSN. Select the environments you want (Production, Preview, and/or Development).
6. Save the variable and redeploy the project.

`NEXT_PUBLIC_` environment variables are embedded into the client bundle at build time. If you change the DSN, redeploy so the new value is included in the build.

The DSN is a client-side ingestion identifier used to send events to Sentry; it is not an authentication secret. Do not put a Sentry auth token in this variable or in browser code.

## Test the app

Use the buttons on `/`:

- **Throw frontend error** — throws an uncaught error from a click handler.
- **Handled error** — catches an error and reports it with the `demo_error_type=handled_frontend` tag.
- **Call /api/error** — calls an API route that throws an unhandled server error.
- **Call /api/handled-error** — reports a caught server error and returns HTTP 500 JSON.
- **Unhandled promise rejection** — creates an unhandled rejected promise.

The page indicates whether a DSN was configured at build time. After triggering errors, open your Sentry project and check **Issues**. Events can take a short moment to appear. The health endpoint at `/api/health` should return HTTP 200 and `{"status":"ok"}`.

## Trigger an intentional failed build

In Vercel, go to **Settings → Environment Variables** and set `BREAK_BUILD` to `true` for the environment you want to test. Trigger a new deployment; Next.js config loading will throw an intentional error and the build should fail. Set `BREAK_BUILD` back to `false` (or remove the variable) and redeploy to restore successful builds.

Do not set `BREAK_BUILD=true` for a deployment you need to keep healthy.

## Let an external monitoring platform read Sentry data

The DSN above only sends events into Sentry. It does not grant an external platform permission to read Issues, Events, or Releases.

For read access, create a Sentry **Internal Integration** in your Sentry organization settings. Give it the minimum required read permissions for **Issues**, **Events**, and **Releases**, then copy its auth token securely into the external monitoring platform's server-side configuration. Also provide your Sentry **organization slug** and **project slug**. Exact permission labels may vary in Sentry's UI.

Keep the auth token private: do not commit it to GitHub, expose it as a `NEXT_PUBLIC_` variable, or put it in this app's client code. This app itself does not need the token, and it does not call Sentry's read API.

## Configuration files

- `sentry.client.config.ts` — browser SDK initialization.
- `sentry.server.config.ts` — Node.js server SDK initialization.
- `sentry.edge.config.ts` — Edge runtime SDK initialization.
- `instrumentation.ts` — loads the runtime-specific SDK config and exports `onRequestError`.
- `instrumentation-client.ts` — loads browser SDK initialization.
- `app/global-error.tsx` — reports errors caught by the root error boundary.
- `next.config.js` — intentionally does not wrap config with `withSentryConfig`; no source-map upload or `SENTRY_AUTH_TOKEN` is required.

All SDK initialization reads `NEXT_PUBLIC_SENTRY_DSN` from the environment and is skipped if it is empty.
