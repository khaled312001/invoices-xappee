import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { restoreOrderFromTrash } from "@/lib/services/orders.service";

export const restoreOrderThunk = createAsyncThunk(
  "orders/restoreOrderThunk",
  async (_id: string) => {
    const order = await restoreOrderFromTrash(_id);
    return order;
  }
);

export const restoreOrderThunkReucers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(restoreOrderThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(restoreOrderThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      const restoredOrder = action.payload;
      state.ordersTrash = state.orders.filter(
        (order) => order._id !== restoredOrder._id
      );

      state.orders.push(restoredOrder);
    })
    .addCase(restoreOrderThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
    });
};
