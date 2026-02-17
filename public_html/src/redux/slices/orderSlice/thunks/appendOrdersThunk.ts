import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { fetchOrderById } from "@/lib/services/orders.service";

export const appendOrdersThunk = createAsyncThunk(
  "orders/appendOrdersThunk",
  async (id: string) => {
    if (!id) return;
    try {
      const order = await fetchOrderById(id);
      if (order && order.id.length > 1 && order.trackingNumber) {
        toast.success("imported successfully");
        return order;
      } else {
        toast.error("no orders imported");
      }
    } catch (err: any) {
      toast.error(
        "something went wrong, are you sure this orders exists in selro?"
      );
    }
  }
);

export const appendOrdersThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(appendOrdersThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(appendOrdersThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      if (!action.payload) return;
      const orderExists = state.orders.find((o) => o.id === action.payload.id);
      if (orderExists) return;
      state.orders = [...state.orders, action.payload];
      state.ordersCount = (state.ordersCount ?? 0 + 1) as number;
    })
    .addCase(appendOrdersThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
    });
};
