import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { publicUser } from "../../lib/data";
import { currentUser } from "../../lib/session";

async function _bold_GET() {
  const user = await currentUser();
  return NextResponse.json({ user: user ? publicUser(user) : null });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
