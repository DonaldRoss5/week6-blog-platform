import { useState } from "react";
import BlogCard from "./BlogCard.jsx";
import { useBlogs } from "../../hooks/useBlogs.js";

/**
 * BlogList:
 *  - Uses the custom useBlogs hook for all Supabase interactions.
 *  - Shows every blog (public feed) or only one author's (authorId).
 *  - Displays loading, error and empty states.
 *
 * @param {object} props
 * @param {string | null} [props.authorId] - Limit the list to this author.
 * @param {string | null} [props.currentUserId] - Signed-in user, for author-only controls.
 * @param {string} [props.emptyTitle]
 * @param {string} [props.emptyMessage]
 */
function BlogList({
  authorId = null,
  currentUserId = null,
  emptyTitle = "No blogs yet",
  emptyMessage = "Check back soon for new posts.",
}) {
  const [actionError, setActionError] = useState("");

  const { blogs, loading, error, deleteBlog } = useBlogs(authorId);

  /**
   * Deletes a blog and reports any failure above the list.
   *
   * @param {string} id - Blog ID.
   */
  const handleDeleteBlog = async (id) => {
    setActionError("");

    try {
      await deleteBlog(id);
    } catch (blogError) {
      setActionError(`Could not delete the blog: ${blogError.message}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        <span>Loading blogs...</span>
      </div>
    );
  }

  return (
    <section className="blog-list">
      {(error || actionError) && (
        <p className="error-text" role="alert">
          {error || actionError}
        </p>
      )}

      {!error && blogs.length === 0 && (
        <div className="empty-state">
          <div>
            <strong>{emptyTitle}</strong>
            <p>{emptyMessage}</p>
          </div>
        </div>
      )}

      {blogs.length > 0 && (
        <ul className="blog-list__items">
          {blogs.map((blog) => (
            <li key={blog.id} className="blog-list__item">
              <BlogCard
                blog={blog}
                currentUserId={currentUserId}
                onDelete={handleDeleteBlog}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BlogList;
