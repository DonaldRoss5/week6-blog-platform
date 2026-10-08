import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import BlogCard from "./BlogCard.jsx";

const blog = {
  id: "blog-1",
  title: "Learning React",
  excerpt: "A short excerpt about learning React step by step.",
  author_name: "Dwayne",
  author_id: "user-a",
  created_at: "2026-01-15T12:00:00.000Z",
  updated_at: "2026-01-15T12:00:00.000Z",
};

function renderCard(props) {
  return render(
    <MemoryRouter>
      <BlogCard blog={blog} onDelete={vi.fn()} {...props} />
    </MemoryRouter>,
  );
}

describe("BlogCard", () => {
  it("shows the title, excerpt and author name", () => {
    renderCard({ currentUserId: null });

    expect(
      screen.getByRole("link", { name: "Learning React" }),
    ).toHaveAttribute("href", "/blogs/blog-1");
    expect(screen.getByText(blog.excerpt)).toBeInTheDocument();
    expect(screen.getByText(/Dwayne/)).toBeInTheDocument();
  });

  it("hides edit and delete controls from people who are not the author", () => {
    renderCard({ currentUserId: "user-b" });

    expect(screen.queryByRole("link", { name: /edit/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it("shows edit and delete controls to the author and calls onDelete", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderCard({ currentUserId: "user-a", onDelete });

    expect(screen.getByRole("link", { name: /edit/i })).toHaveAttribute(
      "href",
      "/blogs/blog-1/edit",
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalled();
  });
});