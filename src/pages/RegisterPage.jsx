import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage({ onSignUp }) {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const data = await onSignUp(displayName.trim(), email.trim(), password);

      if (data.session) {
        navigate("/my-blogs", { replace: true });
      } else {
        setNotice(
          "Account created. Check your email to confirm your address, then log in.",
        );
      }
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <p className="eyebrow">Join the community</p>
          <h1 className="auth-card__title">Create an account</h1>
          <p className="auth-card__subtitle">
            Your display name is shown as the author of your blogs.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="register-display-name">Display name</label>
            <input
              id="register-display-name"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="nickname"
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>

          {error && (
            <p
              role="alert"
              className="auth-form__feedback auth-form__feedback--error"
            >
              {error}
            </p>
          )}

          {notice && (
            <p role="status" className="auth-form__feedback">
              {notice}
            </p>
          )}
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
