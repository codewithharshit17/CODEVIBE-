import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, PrivateRoute } from "../AuthProvider";

const originalWindow = { ...window };

beforeAll(() => {
  const store = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    },
    writable: true,
    configurable: true,
  });
});

afterAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: originalWindow.localStorage,
    writable: true,
    configurable: true,
  });
});

describe("PrivateRoute", () => {
  it("renders children when user is authenticated", () => {
    const futureToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature";

    window.localStorage.setItem("authToken", futureToken);
    window.localStorage.setItem("user", JSON.stringify({ username: "testuser" }));

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <div>Protected Content</div>
                </PrivateRoute>
              </AuthProvider>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Content")).toBeDefined();
  });
});
