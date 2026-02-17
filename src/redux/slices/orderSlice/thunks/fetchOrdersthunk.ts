import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { DateRange } from "react-day-picker";
import { fetchOrdersWithRange } from "@/lib/services/orders.service";

export const fetchOrdersThunk = createAsyncThunk(
  "orders/fetchOrdersThunk",
  async (data: {
    dateRange: DateRange | undefined;
    selectedChannelIds: any;
  }) => {
    if (!data.dateRange || !data.dateRange.from || !data.dateRange.to) {
      throw new Error("pick a date range first.");
    }
    if (data.selectedChannelIds.length === 0) {
      throw new Error("pick at least one channel.");
    }
    const orders = (await fetchOrdersWithRange(
      data.dateRange.from,
      data.dateRange.to,
      data.selectedChannelIds
    )) as any[];
    return orders;
  }
);

export const fetchOrdersThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(fetchOrdersThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      state.orders = action.payload || [];
      state.ordersTrash = [];
      state.ordersCount = action.payload?.length as number;
      state.invoice = undefined;
    })
    .addCase(fetchOrdersThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
    });
};
