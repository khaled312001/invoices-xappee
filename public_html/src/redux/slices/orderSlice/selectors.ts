import { State } from "@/redux/store";
import { createSelector } from "reselect";

export const selectOrderSlice = (state: State) => state.order;

export const selectOrders = createSelector([selectOrderSlice], (orderSlice) =>
  orderSlice.orders.filter((o) => !o.isDeleted)
);

export const selectSoftDeletedOrders = createSelector(
  [selectOrderSlice],
  (orderSlice) => orderSlice.orders.filter((o) => o.isDeleted)
);
