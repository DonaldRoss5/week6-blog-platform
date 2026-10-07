import { useId, useState } from "react";

/**
 * Validates trimmed values against the same limits as the database CHECK
 * constraints: title 3-120, excerpt 10-250, content at least 50 characters.
 */
function validate({ title, excerpt, content }) {
  const errors = {};

  const titleLength = title.trim().length;
  const excerptLength = excerpt.trim().length;
  const contentLength = content.trim().length;

  if (titleLength < 3 || titleLength > 120) {
    errors.title = "Title must be between 3 and 120 characters.";
  }

  if (excerptLength < 10 || excerptLength > 250) {
    errors.excerpt = "Excerpt must be between 10 and 250 characters.";
  }

  if (contentLength < 50) {
    errors.content = "Content must be at least 50 characters.";
  }

  return errors;
}

/**
 * Shared form for creating and editing a blog.
 *
 * @param {object} props
 * @param {{ title?: string, excerpt?: string, content?: string }} [props.initialValues]
 * @param {(values: { title: string, excerpt: string, content: string }) => Promise<void>} props.onSubmit
 * @param {() => void} [props.onCancel]
 * @param {string} [props.submitLabel]
 */
function BlogForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = "Publish blog",
}) {
  const formId = useId();

  const [title, setTitle] = useState(initialValues.title ?? "");
  const [excerpt, setExcerpt] = useState(initialValues.excerpt ?? "");
  const [content, setContent] = useState(initialValues.content ?? "");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  const hasChanges =
    title.trim() !== (initialValues.title ?? "") ||
    excerpt.trim() !== (initialValues.excerpt ?? "") ||
    content.trim() !== (initialValues.content ?? "");

  /**
   * Clears the error for one field when the user edits it.
   */
  const clearError = (field) => {
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSaveError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSaveError("");

    const validationErrors = validate({ title, excerpt, content });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (!hasChanges) return;

    setSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
      });
    } catch (error) {
      setSaveError(error.message || "Could not save the blog. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const titleId = `${formId}-title`;
  const excerptId = `${formId}-excerpt`;
  const contentId = `${formId}-content`;

  return (
    <form
      className="blog-form"
      onSubmit={handleSubmit}
      aria-busy={submitting}
      noValidate
    >
      <fieldset className="blog-form__fields" disabled={submitting}>
        <legend className="sr-only">Blog information</legend>

        <div className="blog-form__field">
          <label htmlFor={titleId}>Title</label>

          <input
            id={titleId}
            name="title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              clearError("title");
            }}
            maxLength={120}
            required
            aria-invalid={Boolean(errors.title)}
            aria-describedby={
              errors.title
                ? `${titleId}-help ${titleId}-error`
                : `${titleId}-help`
            }
          />

          <div className="blog-form__help">
            <span id={`${titleId}-help`}>3 to 120 characters.</span>
            <span>{title.length}/120</span>
          </div>

          {errors.title && (
            <p id={`${titleId}-error`} className="error-text" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="blog-form__field">
          <label htmlFor={excerptId}>Excerpt</label>

          <textarea
            id={excerptId}
            name="excerpt"
            rows={3}
            value={excerpt}
            onChange={(event) => {
              setExcerpt(event.target.value);
              clearError("excerpt");
            }}
            maxLength={250}
            required
            aria-invalid={Boolean(errors.excerpt)}
            aria-describedby={
              errors.excerpt
                ? `${excerptId}-help ${excerptId}-error`
                : `${excerptId}-help`
            }
          />

          <div className="blog-form__help">
            <span id={`${excerptId}-help`}>
              A short summary shown on the blog feed. 10 to 250 characters.
            </span>
            <span>{excerpt.length}/250</span>
          </div>

          {errors.excerpt && (
            <p id={`${excerptId}-error`} className="error-text" role="alert">
              {errors.excerpt}
            </p>
          )}
        </div>

        <div className="blog-form__field">
          <label htmlFor={contentId}>Content</label>

          <textarea
            id={contentId}
            name="content"
            rows={12}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              clearError("content");
            }}
            required
            aria-invalid={Boolean(errors.content)}
            aria-describedby={
              errors.content
                ? `${contentId}-help ${contentId}-error`
                : `${contentId}-help`
            }
          />

          <div className="blog-form__help">
            <span id={`${contentId}-help`}>
              At least 50 characters. Markdown is supported: # heading,
              **bold**, *italic*, - lists, [links](https://example.com) and
              `inline code`.
            </span>
            <span>{content.trim().length} characters</span>
          </div>

          {errors.content && (
            <p id={`${contentId}-error`} className="error-text" role="alert">
              {errors.content}
            </p>
          )}
        </div>
      </fieldset>

      {saveError && (
        <p className="error-text" role="alert">
          {saveError}
        </p>
      )}

      <div className="blog-form__actions">
        <button
          type="submit"
          className="blog-form__save"
          disabled={submitting || !hasChanges}
        >
          {submitting ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            className="blog-form__cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BlogForm;
