import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import BlogForm from "./BlogForm.jsx";

describe("BlogForm", () => {
  it("shows an error for each required field and does not submit empty values", () => {
    const onSubmit = vi.fn();
    const { container } = render(<BlogForm onSubmit={onSubmit} />);

    fireEvent.submit(container.querySelector("form"));

    expect(
      screen.getByText("Title must be between 3 and 120 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Excerpt must be between 10 and 250 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Content must be at least 50 characters."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the values when every field is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<BlogForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), "My first blog");
    await user.type(
      screen.getByLabelText(/excerpt/i),
      "A short summary of my first blog.",
    );
    await user.type(
      screen.getByLabelText(/content/i),
      "This is the content of my first blog post. It is long enough to pass.",
    );
    await user.click(screen.getByRole("button", { name: /publish blog/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "My first blog" }),
    );
  });
});
