import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(new URL("../app/api/documents/[documentId]/route.ts", import.meta.url), "utf8");
const data = await readFile(new URL("../app/lib/data.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("document route exports GET at the requested dynamic route", () => {
  assert.match(route, /export\s+const\s+GET\s*=\s*withBold/);
  assert.match(readme, /app\/api\/documents\/\[documentId\]\/route\.ts/);
  assert.match(readme, /\/api\/documents\/doc_board_packet_101/);
});

test("document response exposes top-level ownerUserId", () => {
  assert.match(route, /ownerUserId:\s*document\.ownerUserId/);
  assert.match(data, /ownerUserId:\s*"usr_101"/);
});

test("route is intentionally authenticated but not owner scoped", () => {
  assert.match(route, /requireUserResponse/);
  assert.doesNotMatch(route, /document\.ownerUserId\s*!==\s*auth\.user\.id/);
  assert.doesNotMatch(route, /document\.ownerUserId\s*===\s*auth\.user\.id/);
  assert.match(route, /Intentional IDOR\/BOLA/);
});

test("vault content is server gated behind a session", () => {
  assert.match(page, /user\s*\?\s*\(/);
  assert.match(page, /<VaultDesk/);
  assert.match(page, /<AuthScreen/);
  assert.match(readme, /vault content is only rendered after a valid session/i);
});
