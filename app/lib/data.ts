export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
};

export type VaultDocument = {
  documentId: string;
  ownerUserId: string;
  title: string;
  classification: "internal" | "confidential" | "restricted";
  folder: "Board" | "Finance" | "Support" | "Legal";
  checksum: string;
  sizeKb: number;
  updatedAt: string;
  summary: string;
  pages: Array<{
    page: number;
    heading: string;
    excerpt: string;
  }>;
  auditNote: string;
};

export const users: User[] = [
  {
    id: "usr_101",
    email: "maya@bold.test",
    password: "demo1234",
    name: "Maya Chen",
    role: "Board Coordinator"
  },
  {
    id: "usr_202",
    email: "liam@bold.test",
    password: "demo1234",
    name: "Liam Brooks",
    role: "Finance Controller"
  },
  {
    id: "usr_303",
    email: "sofia@bold.test",
    password: "demo1234",
    name: "Sofia Rivera",
    role: "Support Lead"
  }
];

export function createUser(input: { email: string; password: string; name: string }) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user: User = {
    id: `usr_${String(400 + users.length + 1)}`,
    email: normalizedEmail,
    password: input.password,
    name: input.name.trim(),
    role: "Vault Reviewer"
  };

  users.push(user);
  return user;
}

export const documents: VaultDocument[] = [
  {
    documentId: "doc_board_packet_101",
    ownerUserId: "usr_101",
    title: "Board Packet - Launch Readiness",
    classification: "confidential",
    folder: "Board",
    checksum: "sha256:7f0b9d0af9d6a5a8",
    sizeKb: 842,
    updatedAt: "2026-06-20T14:15:00.000Z",
    summary: "Launch readiness notes, partner status, and unresolved risk items for Maya's board packet.",
    pages: [
      {
        page: 1,
        heading: "Executive snapshot",
        excerpt: "Pilot adoption is ahead of plan, but operational readiness depends on final access-control signoff."
      },
      {
        page: 2,
        heading: "Action log",
        excerpt: "Prepare final customer proof points and confirm launch budget allocation before review."
      }
    ],
    auditNote: "Board material should only be visible to the owner and explicitly invited reviewers."
  },
  {
    documentId: "doc_finance_review_202",
    ownerUserId: "usr_202",
    title: "Finance Review - Vendor Renewal",
    classification: "restricted",
    folder: "Finance",
    checksum: "sha256:41c2fbadcc09e118",
    sizeKb: 1198,
    updatedAt: "2026-06-18T09:45:00.000Z",
    summary: "Vendor renewal model, internal approval notes, and Liam's negotiation assumptions.",
    pages: [
      {
        page: 1,
        heading: "Renewal position",
        excerpt: "Preferred renewal target is below current quote; do not disclose the approval ceiling externally."
      },
      {
        page: 2,
        heading: "Approval notes",
        excerpt: "Finance recommends approval only if security addendum language remains unchanged."
      }
    ],
    auditNote: "Contains negotiation context. Real document services must enforce owner-scoped reads."
  },
  {
    documentId: "doc_support_escalation_303",
    ownerUserId: "usr_303",
    title: "Support Escalation - Enterprise Pilot",
    classification: "internal",
    folder: "Support",
    checksum: "sha256:a6eb514d2f7d029c",
    sizeKb: 524,
    updatedAt: "2026-06-22T18:30:00.000Z",
    summary: "Support timeline, customer-facing follow-up notes, and Sofia's draft remediation plan.",
    pages: [
      {
        page: 1,
        heading: "Timeline",
        excerpt: "Initial incident was acknowledged within SLA; final response needs legal review."
      },
      {
        page: 2,
        heading: "Draft response",
        excerpt: "Confirm root cause language before sending to the enterprise pilot sponsor."
      }
    ],
    auditNote: "Support notes are owner-scoped until shared through an approved review workflow."
  }
];

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email.toLowerCase());
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function findDocumentById(documentId: string) {
  return documents.find((document) => document.documentId === documentId);
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}
