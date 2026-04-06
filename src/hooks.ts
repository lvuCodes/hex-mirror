import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { AppDispatch } from "./store";
import { addItem, selectItems } from "./slices";
import type { ColorCard } from "./slices";

export function useColorList() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectItems);

  return {
    items,
    inputItem: items[0],
    addItem: (item: ColorCard) => dispatch(addItem(item)),
  };
}
