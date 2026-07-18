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
      </Provider>
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Hex Mirror" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
