import AuthScreen from "./vault/auth-screen";
import VaultDesk from "./vault/vault-desk";
import { currentUser } from "./lib/session";
import { documents, publicUser, users } from "./lib/data";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="shell">
      <section className="topbar" aria-labelledby="title">
        <div>
          <p className="eyebrow">BoLD fixture / App 4</p>
          <h1 id="title">Document Vault</h1>
        </div>
        <div className="endpoint">
          <span>GET</span>
          <code>/api/documents/[documentId]</code>
        </div>
      </section>

      {user ? (
        <VaultDesk
          user={publicUser(user)}
          documents={documents.map(({ documentId, ownerUserId, title, folder, classification, updatedAt }) => ({
            documentId,
            ownerUserId,
            title,
            folder,
            classification,
            updatedAt
          }))}
        />
      ) : (
        <AuthScreen demoUsers={users.map(publicUser)} />
      )}
    </main>
  );
}
