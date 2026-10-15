import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Mark } from "@/components/Mark";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="login">
      <div className="login-card">
        <a className="admin-brand" href="/">
          <Mark />
          <span>{brand.name}</span>
        </a>
        <h1>Sign in to edit your website</h1>
        <LoginForm />
        <p className="help">Forgot your password? Ask another owner to reset it under People, or contact your developer.</p>
      </div>
    </main>
  );
}
