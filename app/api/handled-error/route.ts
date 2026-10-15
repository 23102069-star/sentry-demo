import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Sentry demo: handled server API error");
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("demo_error_type", "handled_server_api");
      Sentry.captureException(error);
    });

    return NextResponse.json(
      { status: "error", message: "A demo error was captured by Sentry." },
      { status: 500 },
    );
  }
}
