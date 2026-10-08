import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/formatDate.js";
/**
 * Formats an ISO timestamp as a readable date, e.g. "October 7, 2026".
 */
// function formatDate(isoString) {
//   return new Date(isoString).toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

/**
 * Displays one blog preview: title, author, publish date and excerpt.
 * Edit and delete controls appear only for the blog's author.
 *
 * @param {object} props
 * @param {{ id: string, title: string, excerpt: string, author_id: string, author_name: string, created_at: string }} props.blog
 * @param {string | null} [props.currentUserId] - The signed-in user's id, if any.
 * @param {(id: string) => void} [props.onDelete]
 */
export default function BlogCard({ blog, currentUserId = null, onDelete }) {
  const [working, setWorking] = useState(false);

  const isAuthor = Boolean(currentUserId) && currentUserId === blog.author_id;

  /**
   * Confirms, then asks the parent to delete this blog.
   */
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) {
      return;
    }

    setWorking(true);

    try {
      await onDelete(blog.id);
    } finally {
      setWorking(false);
    }
  };

  return (
    <article className="blog-card">
      <h3 className="blog-card__title">
        <Link className="blog-card__link" to={`/blogs/${blog.id}`}>
          {blog.title}
        </Link>
      </h3>

      <p className="blog-card__meta">
        By <span className="blog-card__author">{blog.author_name}</span> on{" "}
        <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
      </p>

      <p className="blog-card__excerpt">{blog.excerpt}</p>

      {isAuthor && (
        <div className="blog-card__actions">
          <Link
            className="blog-card__edit"
            to={`/blogs/${blog.id}/edit`}
            aria-label={`Edit ${blog.title}`}
          >
            Edit
          </Link>

          {onDelete && (
            <button
              type="button"
              className="blog-card__delete"
              onClick={handleDelete}
              disabled={working}
              aria-label={`Delete ${blog.title}`}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
