import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { toast } from "sonner";
import { softDeleteOrder } from "@/lib/services/orders.service";

export const softDeleteOrderThunk = createAsyncThunk(
  "orders/softDeleteOrderThunk",
  async (_id: string) => {
    try {
      const softDeletedOrder = await softDeleteOrder(_id);
      toast.success(`Deleted order ${softDeletedOrder.id} successfully!`);
      return softDeletedOrder;
    } catch (error) {
      toast.error("Error deleting order");
    }
  }
);

export const softDeleteOrderThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(softDeleteOrderThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(softDeleteOrderThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      const softDeletedOrder = action.payload;
      state.orders = state.orders.filter(
        (order) => order._id !== softDeletedOrder._id
      );

      state.ordersTrash.push(softDeletedOrder);
    })
    .addCase(softDeleteOrderThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
    });
};
