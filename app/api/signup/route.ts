import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { createUser, findUserByEmail, publicUser } from "../../lib/data";
import { setSessionCookie } from "../../lib/session";

async function _bold_POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const name = String(body?.name || "").trim();

  if (!name || !email || !email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Name, valid email, and password of at least 8 characters are required" }, { status: 400 });
  }

  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const user = createUser({ email, password, name });
  const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
  setSessionCookie(response, user);
  return response;
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId }
);
