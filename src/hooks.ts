import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./store";
import type { ColorCard } from "./utils";
import { addItem, updateItem, selectItems } from "./slices";

export function useColorList() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectItems);

  return {
    items,
    inputItem: items[0],
    addItem: (item: ColorCard) => dispatch(addItem(item)),
    updateItem: (index: number, item: ColorCard) =>
      dispatch(updateItem({ index, item })),
  };
}
