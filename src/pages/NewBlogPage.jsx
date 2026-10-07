import { useNavigate } from "react-router-dom";
import BlogForm from "../components/blogs/BlogForm.jsx";
import { useBlogs } from "../hooks/useBlogs.js";

function NewBlogPage({ user }) {
  const navigate = useNavigate();
  const { createBlog } = useBlogs(user?.id);

  const handleCreateBlog = async (values) => {
    const blog = await createBlog(values, user);

    navigate(`/blogs/${blog.id}`, {
      replace: true,
      state: { notice: "Blog published successfully." },
    });
  };

  const handleCancel = () => {
    navigate("/my-blogs");
  };

  return (
    <section className="page">
      <header className="page__header">
        <p className="eyebrow">Your workspace</p>
        <h1 className="page__title">Write a blog</h1>
        <p className="page__description">
          Share something with the community. Your display name is shown as the
          author.
        </p>
      </header>

      <div className="card blog-form-card">
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={handleCancel}
          submitLabel="Publish blog"
        />
      </div>
    </section>
  );
}

export default NewBlogPage;
