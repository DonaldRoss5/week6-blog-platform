import { Link } from "react-router-dom";
import BlogList from "../components/blogs/BlogList.jsx";

function HomePage({ user }) {
  return (
    <section className="page">
      <header className="page__header">
        <p className="eyebrow">Latest posts</p>
        <h1 className="page__title">Blog Platform</h1>
        <p className="page__description">
          Read the newest posts from our community, or share one of your own.
        </p>

        <Link
          className="home-page__action"
          to={user ? "/blogs/new" : "/register"}
        >
          {user ? "Write a blog" : "Create an account to write"}
        </Link>
      </header>

      <BlogList currentUserId={user?.id ?? null} />
    </section>
  );
}

export default HomePage;
