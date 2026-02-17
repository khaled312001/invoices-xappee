import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { ItemSliceInitialState } from "../itemSlice";
import { fetchPaginatedItems } from "@/lib/services/item.service";

export const fetchPaginatedItemsThunk = createAsyncThunk(
  "orders/fetchOrdersThunk",
  async (page: number) => {
    const { items, nextPage } = await fetchPaginatedItems(page);
    return { items, nextPage };
  }
);

export const fetchPaginatedItemsThunkReducer = (
  builder: ActionReducerMapBuilder<ItemSliceInitialState>
) => {
  builder
    .addCase(fetchPaginatedItemsThunk.pending, (state) => {
      state.itemsStatus = "loading";
    })
    .addCase(fetchPaginatedItemsThunk.fulfilled, (state, action) => {
      state.itemsStatus = "succeeded";
      if (action.payload?.nextPage && action.payload.items) {
        state.items = [...state.items, ...action.payload.items];
        state.page = action.payload.nextPage;
      }
    })
    .addCase(fetchPaginatedItemsThunk.rejected, (state, action) => {
      state.itemsStatus = "failed";
      state.itemsError = action.error.message;
      toast.error(
        "Something went wrong, please try again. | " + action.error.message
      );
    });
};
