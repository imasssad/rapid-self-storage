"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  // Bumped on every submit so a repeated error message still replays its entrance.
  const [attempt, setAttempt] = useState(0);

  return (
    <form action={action} onSubmit={() => setAttempt((n) => n + 1)} className="login-form">
      {state?.error && (
        <div key={attempt} className="notice error login-error" role="alert">
          {state.error}
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <div className="input-icon">
          <Icon name="mail" className="icon-sm" />
          <input id="email" name="email" type="email" autoComplete="username" autoFocus required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="input-icon">
          <Icon name="lock" className="icon-sm" />
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
          <button
            type="button"
            className="reveal"
            onClick={() => setShowPassword((v) => !v)}
            aria-controls="password"
            aria-pressed={showPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} className="icon-sm" />
          </button>
        </div>
      </div>
      <button type="submit" className="btn-admin primary wide login-submit" disabled={pending}>
        {pending ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <Icon name="arrow" className="icon-sm" />
          </>
        )}
      </button>
    </form>
  );
}
