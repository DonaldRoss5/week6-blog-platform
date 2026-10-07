import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ProtectedRoute from "./ProtectedRoute.jsx";

function renderRoutes(user) {
  return render(
    <MemoryRouter initialEntries={["/my-blogs"]}>
      <Routes>
        <Route path="/login" element={<h1>Login page</h1>} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/my-blogs" element={<h1>My blogs page</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects a logged-out visitor to the login page", () => {
    renderRoutes(null);

    expect(
      screen.getByRole("heading", { name: "Login page" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "My blogs page" }),
    ).not.toBeInTheDocument();
  });

  it("shows the protected page to a logged-in user", () => {
    renderRoutes({ id: "user-a" });

    expect(
      screen.getByRole("heading", { name: "My blogs page" }),
    ).toBeInTheDocument();
  });
});
