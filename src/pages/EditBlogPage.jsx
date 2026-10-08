import { Link, useNavigate, useParams } from "react-router-dom";
import BlogForm from "../components/blogs/BlogForm.jsx";
import { useBlog } from "../hooks/useBlogs.js";

function EditBlogPage({ userId }) {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const { blog, loading, error, updateBlog } = useBlog(blogId);

  const handleSaveBlog = async (values) => {
    await updateBlog(values);

    navigate(`/blogs/${blogId}`, {
      replace: true,
      state: { notice: "Blog updated successfully." },
    });
  };

  const handleCancel = () => {
    navigate(`/blogs/${blogId}`);
  };

  if (loading) {
    return (
      <div className="loading-state" role="status">
        Loading blog...
      </div>
    );
  }

  // Same message for "missing" and "not yours", so nothing is revealed.
  if (error || !blog || blog.author_id !== userId) {
    return (
      <section className="blog-details">
        <h1 className="blog-details__title">Blog unavailable</h1>

        <p className="error-text" role="alert">
          This blog was not found, or you are not allowed to edit it.
        </p>

        <Link className="blog-details__back" to="/my-blogs">
          Back to my blogs
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page__header">
        <p className="eyebrow">Your workspace</p>
        <h1 className="page__title">Edit blog</h1>
        <p className="page__description">
          Update the title, excerpt or content of your blog.
        </p>
      </header>

      <div className="card blog-form-card">
        <BlogForm
          key={blog.id}
          initialValues={{
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
          }}
          onSubmit={handleSaveBlog}
          onCancel={handleCancel}
          submitLabel="Save changes"
        />
      </div>
    </section>
  );
}

export default EditBlogPage;
