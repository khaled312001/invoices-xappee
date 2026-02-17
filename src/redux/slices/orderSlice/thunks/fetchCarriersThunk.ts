import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { getCarriers } from "@/lib/services/carrier.service";

export const fetchCarriersThunk = createAsyncThunk(
  "orders/fetchCarriersThunk  ",
  async () => {
    const carriers = await getCarriers();
    return carriers;
  }
);

export const fetchCarriersThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(fetchCarriersThunk.pending, (state) => {
      state.carrierStatus = "loading";
    })
    .addCase(fetchCarriersThunk.fulfilled, (state, action) => {
      state.carrierStatus = "succeeded";
      state.carriers = action.payload;
    })
    .addCase(fetchCarriersThunk.rejected, (state, action) => {
      state.carrierStatus = "failed";
    });
};
