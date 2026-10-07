import ReactMarkdown from "react-markdown";
import { Link, useLocation, useParams } from "react-router-dom";
import { useBlog } from "../hooks/useBlogs.js";
import { formatDate } from "../lib/formatDate.js";

// Open links from blog content in a new tab, safely.
const markdownComponents = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

function BlogDetailPage({ userId }) {
  const { blogId } = useParams();
  const location = useLocation();

  const { blog, loading, error } = useBlog(blogId);

  const notice = location.state?.notice;

  if (loading) {
    return (
      <div className="loading-state" role="status">
        Loading blog...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <section className="blog-details">
        <h1 className="blog-details__title">Blog unavailable</h1>

        <p className="error-text" role="alert">
          This blog was not found or could not be loaded.
        </p>

        <Link className="blog-details__back" to="/">
          Back to all blogs
        </Link>
      </section>
    );
  }

  const isAuthor = Boolean(userId) && userId === blog.author_id;
  const wasEdited = blog.updated_at !== blog.created_at;

  return (
    <article className="blog-details">
      {notice && (
        <p className="blog-details__notice" role="status">
          {notice}
        </p>
      )}

      <p className="eyebrow">Blog post</p>

      <h1 className="blog-details__title">{blog.title}</h1>

      <p className="blog-details__meta">
        By <span className="blog-details__author">{blog.author_name}</span> on{" "}
        <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
        {wasEdited && (
          <>
            {" "}
            (updated{" "}
            <time dateTime={blog.updated_at}>{formatDate(blog.updated_at)}</time>
            )
          </>
        )}
      </p>

      <div className="blog-details__content">
        <ReactMarkdown components={markdownComponents}>
          {blog.content}
        </ReactMarkdown>
      </div>

      <div className="blog-details__actions">
        {isAuthor && (
          <Link className="blog-details__edit" to={`/blogs/${blog.id}/edit`}>
            Edit blog
          </Link>
        )}

        <Link className="blog-details__back" to="/">
          Back to all blogs
        </Link>
      </div>
    </article>
  );
}

export default BlogDetailPage;