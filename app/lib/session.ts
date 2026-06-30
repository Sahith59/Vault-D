import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserById, publicUser, type User } from "./data";

const COOKIE_NAME = "bold_document_vault_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "bold-document-vault-local-secret";

type SessionPayload = {
  userId: string;
  issuedAt: number;
  profile?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function createSessionToken(user: User) {
  const payload = base64url(JSON.stringify({ userId: user.id, issuedAt: Date.now(), profile: publicUser(user) } satisfies SessionPayload));
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = readSessionToken(token);
  if (!session) return null;

  const seededUser = findUserById(session.userId);
  if (seededUser) return seededUser;
  if (!session.profile) return null;

  return {
    ...session.profile,
    password: ""
  };
}

export function setSessionCookie(response: NextResponse, user: User) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: createSessionToken(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function requireUserResponse() {
  const user = await currentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 })
    };
  }

  return {
    user: publicUser(user),
    response: null
  };
}
