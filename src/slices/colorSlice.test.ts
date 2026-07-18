import { describe, it, expect } from "vitest";
import reducer, {
  updateItem,
  seedRandomColor,
  selectItems,
  initialState,
} from "./colorSlice";
import { RootInitialState } from "../store";
import { calculateHexAttr, isHexCode } from "../utils";

describe("colorSlice", () => {
  it("replaces the item at the given index", () => {
    const item = calculateHexAttr({ red: 255, green: 0, blue: 0 });
    const state = reducer(initialState, updateItem({ index: 0, item }));
    expect(state.items[0]).toEqual(item);
  });

  it("seedRandomColor produces an updateItem action with a valid hex", () => {
    const action = seedRandomColor();
    expect(action.type).toBe(updateItem.type);
    expect(action.payload.index).toBe(0);
    expect(isHexCode(action.payload.item.hex)).toBe(true);
  });

  it("selectItems reads the color list from root state", () => {
    expect(selectItems(RootInitialState)).toBe(initialState.items);
  });
});
