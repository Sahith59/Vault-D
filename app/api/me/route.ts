import { NextResponse } from "next/server";
import { publicUser } from "../../lib/data";
import { currentUser } from "../../lib/session";

export async function GET() {
  const user = await currentUser();
  return NextResponse.json({ user: user ? publicUser(user) : null });
}
