import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { LoginShowcase } from "@/components/admin/LoginShowcase";
import { Icon } from "@/components/Icon";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: `Sign in to ${brand.name}` };

export default function LoginPage() {
  return (
    <main className="login">
      <LoginShowcase />
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-inner">
          <div className="login-head">
            <h1 id="login-title">
              Welcome back<span className="sr-only"> to {brand.name}</span>
            </h1>
            <p>Sign in to edit your website.</p>
          </div>
          <LoginForm />
          <p className="help login-help">
            Forgot your password? Ask another owner to reset it under People who can sign in, or contact your developer.
          </p>
          <a className="login-back" href="/">
            <Icon name="arrow" className="icon-xs flip" />
            Back to the website
          </a>
        </div>
      </section>
    </main>
  );
}
