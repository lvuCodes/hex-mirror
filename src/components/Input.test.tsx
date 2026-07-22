import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import Input from "./Input";

const renderInput = () =>
  render(
    <Provider store={store}>
      <Input />
    </Provider>,
  );

describe("Input", () => {
  it("flags an invalid hex with the error class and clears it on a valid one", () => {
    renderInput();
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "#ZZZ" } });
    expect(input).toHaveClass("error");

    fireEvent.change(input, { target: { value: "#00FF00" } });
    expect(input).not.toHaveClass("error");
  });

  it("keeps the displayed value prefixed with '#' and uppercased", () => {
    renderInput();
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "#abc123" } });
    expect(input.value).toBe("#ABC123");
  });
});
