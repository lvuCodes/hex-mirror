import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

describe("App", () => {
  it("renders the heading and the input card", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Hex Mirror" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

describe("footer copyright", () => {
  it("carries the GPL notice and links the license", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const notice = screen.getByText(/© 2026/);
    expect(notice.textContent).toContain("Free software under the");

    const license = screen.getByRole("link", { name: "GNU GPL v3" });
    expect(license.getAttribute("href")).toBe(
      "https://github.com/lvuCodes/hex-mirror/blob/main/LICENSE",
    );
    expect(screen.getByRole("link", { name: "lvuCodes" }).getAttribute("href")).toBe(
      "https://github.com/lvuCodes",
    );
  });
});
