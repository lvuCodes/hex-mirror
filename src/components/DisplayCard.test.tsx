import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import DisplayCard from "./DisplayCard";
import colorListReducer from "../slices/colorSlice";

const renderCard = () => {
  const store = configureStore({ reducer: { colorList: colorListReducer } });
  return render(
    <Provider store={store}>
      <DisplayCard />
    </Provider>
  );
};

describe("DisplayCard", () => {
  it("renders the input and the mirror table", () => {
    const { container } = renderCard();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(container.querySelectorAll("tbody tr")).toHaveLength(9);
  });

  it("reflects a valid hex as the card background color", () => {
    const { container } = renderCard();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "#00FF00" },
    });
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: "#00FF00" });
  });
});
