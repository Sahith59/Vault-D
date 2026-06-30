import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../lib/bold";
import { findDocumentById } from "../../../lib/data";
import { requireUserResponse } from "../../../lib/session";

type RouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { documentId } = await params;
  const document = findDocumentById(documentId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Intentional IDOR/BOLA for BoLD testing:
  // this route authenticates the caller but intentionally skips ownerUserId scoping.
  return NextResponse.json({
    documentId: document.documentId,
    ownerUserId: document.ownerUserId,
    title: document.title,
    classification: document.classification,
    folder: document.folder,
    checksum: document.checksum,
    sizeKb: document.sizeKb,
    updatedAt: document.updatedAt,
    summary: document.summary,
    pages: document.pages,
    auditNote: document.auditNote,
    requestedBy: auth.user
  });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
