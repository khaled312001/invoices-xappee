import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { toast } from "sonner";
import { fixOneOrder } from "@/lib/services/orders.service";

export const fixOneOrderThunk = createAsyncThunk(
  "orders/fixOneOrderThunk",
  async (id: string) => {
    if (!id) return;
    try {
      const order = await fixOneOrder(id);
      if (order) {
        toast.success("Fixed order successfully");
        return order;
      } else {
        toast.error("Can't fix order.");
      }
    } catch (err: any) {
      toast.error(
        "something went wrong, are you sure this orders exists in selro?"
      );
    }
  }
);

export const fixOneOrderThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(fixOneOrderThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(fixOneOrderThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
    })
    .addCase(fixOneOrderThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
    });
};
