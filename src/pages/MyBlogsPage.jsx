import { Link } from "react-router-dom";
import BlogList from "../components/blogs/BlogList.jsx";

function MyBlogsPage({ userId }) {
  return (
    <section className="page">
      <header className="page__header">
        <p className="eyebrow">Your workspace</p>
        <h1 className="page__title">My Blogs</h1>
        <p className="page__description">
          Open, edit or delete the blogs you have published.
        </p>

        <Link className="home-page__action" to="/blogs/new">
          Write a new blog
        </Link>
      </header>

      <BlogList
        authorId={userId}
        currentUserId={userId}
        emptyTitle="You have not written any blogs yet"
        emptyMessage="Choose Write a new blog to publish your first post."
      />
    </section>
  );
}

export default MyBlogsPage;
