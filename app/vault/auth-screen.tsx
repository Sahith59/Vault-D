"use client";

import { useState } from "react";

type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type Mode = "login" | "signup";

export default function AuthScreen({ demoUsers }: { demoUsers: PublicUser[] }) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(demoUsers[0]?.email || "");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const endpoint = mode === "login" ? "/api/login" : "/api/signup";
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await result.json();

    if (!result.ok) {
      setPending(false);
      setError(data.error || "Authentication failed");
      return;
    }

    window.location.reload();
  }

  return (
    <section className="authShell" aria-labelledby="auth-title">
      <div className="authCopy">
        <p className="kicker">Access required</p>
        <h2 id="auth-title">Sign in before opening the vault</h2>
        <p className="muted">
          Vault rows and document previews are only rendered after a valid session is created.
        </p>
      </div>

      <div className="authCard">
        <div className="modeSwitch" aria-label="Authentication mode">
          <button className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")} type="button">
            Login
          </button>
          <button className={mode === "signup" ? "selected" : ""} onClick={() => setMode("signup")} type="button">
            Sign up
          </button>
        </div>

        <form className="form" onSubmit={submit}>
          {mode === "signup" ? (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Jordan Lee" />
            </label>
          ) : (
            <label>
              Demo account
              <select value={email} onChange={(event) => setEmail(event.target.value)}>
                {demoUsers.map((demoUser) => (
                  <option key={demoUser.id} value={demoUser.email}>
                    {demoUser.email} ({demoUser.id})
                  </option>
                ))}
              </select>
            </label>
          )}

          {mode === "signup" ? (
            <label>
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>
          ) : null}

          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>

          {error ? <p className="error">{error}</p> : null}
          <button className="button" disabled={pending} type="submit">
            {pending ? "Working..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}
