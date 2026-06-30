"use client";

import { useMemo, useState } from "react";

type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type VaultRow = {
  documentId: string;
  ownerUserId: string;
  title: string;
  folder: string;
  classification: string;
  updatedAt: string;
};

export default function VaultDesk({
  user,
  documents
}: {
  user: PublicUser;
  documents: VaultRow[];
}) {
  const [activeId, setActiveId] = useState(documents[0]?.documentId || "");
  const [status, setStatus] = useState("idle");
  const [response, setResponse] = useState("Select a document to preview its API response.");

  const active = useMemo(() => documents.find((document) => document.documentId === activeId) || documents[0], [
    activeId,
    documents
  ]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  }

  async function fetchDocument(documentId = activeId) {
    setActiveId(documentId);
    setStatus("loading");
    const result = await fetch(`/api/documents/${encodeURIComponent(documentId)}`);
    const text = await result.text();

    try {
      setResponse(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      setResponse(text);
    }

    setStatus(`${result.status} ${result.statusText}`);
  }

  return (
    <section className="desk">
      <aside className="sidebar">
        <div className="brandBlock">
          <p className="kicker">Session</p>
          <div className="signedIn">
            <p className="identity">{user.name}</p>
            <p className="muted">
              {user.role}
              <br />
              <strong>{user.id}</strong>
            </p>
            <button className="button dark" onClick={logout} type="button">
              Sign out
            </button>
          </div>
        </div>

        <div className="routeCard">
          <p className="kicker">Probe target</p>
          <code>/api/documents/{active?.documentId || "documentId"}</code>
          <button className="button" onClick={() => fetchDocument(active?.documentId)} type="button">
            Fetch active document
          </button>
        </div>
      </aside>

      <section className="tablePanel" aria-label="Document list">
        <div className="panelHead">
          <div>
            <p className="kicker">Vault index</p>
            <h2>Documents</h2>
          </div>
          <span className="status">{status}</span>
        </div>

        <div className="docTable" role="table">
          <div className="tableRow tableHeader" role="row">
            <span>Document</span>
            <span>Owner</span>
            <span>Class</span>
            <span>Updated</span>
          </div>
          {documents.map((document) => (
            <button
              className={document.documentId === activeId ? "tableRow active" : "tableRow"}
              key={document.documentId}
              onClick={() => fetchDocument(document.documentId)}
              role="row"
              type="button"
            >
              <span>
                <strong>{document.title}</strong>
                <small>{document.documentId}</small>
              </span>
              <span>{document.ownerUserId}</span>
              <span>{document.classification}</span>
              <span>{new Date(document.updatedAt).toISOString().slice(0, 10)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="previewPanel" aria-label="Document API response">
        <div className="panelHead">
          <div>
            <p className="kicker">Response</p>
            <h2>JSON preview</h2>
          </div>
        </div>
        <pre className="response">{response}</pre>
      </section>
    </section>
  );
}
