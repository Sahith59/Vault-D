import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { clearSessionCookie } from "../../lib/session";

async function _bold_POST() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId }
);
