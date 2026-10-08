import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import BlogDetailPage from "./BlogDetailPage.jsx";

vi.mock("../hooks/useBlogs.js", () => ({
  useBlog: () => ({
    loading: false,
    error: "",
    blog: {
      id: "blog-1",
      title: "Markdown Post",
      excerpt: "An excerpt that is long enough.",
      author_id: "user-a",
      author_name: "Dwayne",
      created_at: "2026-01-15T12:00:00.000Z",
      updated_at: "2026-01-15T12:00:00.000Z",
      content:
        "## Section heading\n\nSome **bold** and *italic* text.\n\n- first item\n- second item\n\n[Example](https://example.com) and `inline code`.",
    },
  }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/blogs/blog-1"]}>
      <Routes>
        <Route
          path="/blogs/:blogId"
          element={<BlogDetailPage userId={null} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BlogDetailPage Markdown", () => {
  it("renders Markdown content as formatted HTML", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Section heading", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByText("italic").tagName).toBe("EM");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByText("inline code").tagName).toBe("CODE");
  });

  it("shows no edit link to a logged-out visitor", () => {
    renderPage();

    expect(
      screen.queryByRole("link", { name: /edit/i }),
    ).not.toBeInTheDocument();
  });
});
