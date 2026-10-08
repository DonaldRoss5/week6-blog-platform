import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm.jsx";

function LoginPage({ onSignIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname ?? "/my-blogs";

  async function handleSubmit({ email, password }) {
    await onSignIn(email, password);
    navigate(destination, { replace: true });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <h1 className="auth-card__title">Log in</h1>
          <p className="auth-card__subtitle">
            Log in to write, edit and manage your blogs.
          </p>
        </header>
        <AuthForm mode="login" onSubmit={handleSubmit} />
        <p className="auth-card__footer">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
