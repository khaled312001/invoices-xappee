import { fetchSearchItem } from "@/lib/services/item.service";
import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { ItemSliceInitialState } from "../itemSlice";

export const fetchItemSearchQueryThunk = createAsyncThunk(
  "items/fetchItemSearchQeuryThunk",
  async (query: string, { rejectWithValue }) => {
    try {
      const item = await fetchSearchItem(query);
      if (!item) {
        // No item found, return a specific indicator or use rejectWithValue
        return rejectWithValue("Item not found");
      }
      return item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchItemSearchQueryThunkreducers = (
  builder: ActionReducerMapBuilder<ItemSliceInitialState>
) => {
  builder
    .addCase(fetchItemSearchQueryThunk.pending, (state) => {
      state.itemsStatus = "loading";
    })
    .addCase(fetchItemSearchQueryThunk.fulfilled, (state, action) => {
      state.itemsStatus = "succeeded";
      state.items.push(action.payload);
      //   state.items = [...state.items, action.payload];
    })
    .addCase(fetchItemSearchQueryThunk.rejected, (state, action) => {
      state.itemsStatus = "failed";
      state.itemsError = action.error.message;
    });
};
