# BoLD App 4 - Document Vault IDOR

Standalone Next.js application for testing BoLD against an IDOR/BOLA flaw in a document vault workflow.

## Contract

- Route: `app/api/documents/[documentId]/route.ts`
- Method: `GET`
- ID shape: opaque document ID in the path, for example `/api/documents/doc_board_packet_101`
- Auth: request must come from a logged-in user
- Login/signup: vault content is only rendered after a valid session is created
- Response JSON includes top-level `ownerUserId`, such as `usr_101`
- Intentional flaw: any logged-in user can read any document by ID, even when they do not own it

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Users

All accounts use password `demo1234`.

- `maya@bold.test` -> `usr_101`
- `liam@bold.test` -> `usr_202`
- `sofia@bold.test` -> `usr_303`

## Test Probe

1. Log in as `maya@bold.test`.
2. Fetch `/api/documents/doc_board_packet_101`.
3. The response is Maya's document and includes `"ownerUserId":"usr_101"`.
4. Fetch `/api/documents/doc_finance_review_202`.
5. The response is Liam's document and includes `"ownerUserId":"usr_202"`, even though Maya is still logged in.

That cross-user document read is the intentional IDOR/BOLA behavior for BoLD to detect.

## Deploy

This folder is self-contained and can be pushed as its own GitHub repository or imported directly into Vercel.
