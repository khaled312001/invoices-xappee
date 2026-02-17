import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { toast } from "sonner";
import { updateOrder } from "@/lib/services/orders.service";

export const updateShippingInfoThunk = createAsyncThunk(
  "orders/updateShippingInfoThunk",
  async (data: { id: string; orderData: any }) => {
    if (!data.id) return;
    try {
      const ok = await updateOrder(data.id, data.orderData);
      if (ok) {
        return data.orderData;
      } else {
        toast.error("Can't update order.");
      }
    } catch (err: any) {
      toast.error("something went wrong " + err.message);
    }
  }
);

export const updateShippingInfoThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(updateShippingInfoThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(updateShippingInfoThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      state.orders = state.orders.map((o) =>
        o.id === action.payload.id ? { ...o, ...action.payload } : o
      );
    })
    .addCase(updateShippingInfoThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
    });
};
