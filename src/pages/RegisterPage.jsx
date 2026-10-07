import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm.jsx";

function RegisterPage({ onSignUp }) {
  const navigate = useNavigate();

  async function handleSubmit({ displayName, email, password }) {
  const result = await onSignUp(displayName, email, password);

  if (result.session) {
    navigate("/my-blogs", { replace: true });
    return null;
  }

  return {
    notice: "Account created. Check your email to confirm it, then log in.",
  };
}

    return (
    <section className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <h1 className="auth-card__title">Create an account</h1>
          <p className="auth-card__subtitle">
            Pick a display name. It appears on every blog you publish.
          </p>
        </header>
        <AuthForm mode="register" onSubmit={handleSubmit} />
        <p className="auth-card__footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
