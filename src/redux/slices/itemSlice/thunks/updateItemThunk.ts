import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { ItemSliceInitialState } from "../itemSlice";
import { updateItem } from "@/lib/services/item.service";
import { toast } from "sonner";
import { revalidateItemsInitialLoad } from "@/lib/actions/revalidateTag";

export const updateItemThunk = createAsyncThunk(
  "items/updateItemThunk",
  async (item: any) => {
    const isUpdated = await updateItem(item);
    if (isUpdated) {
      revalidateItemsInitialLoad();
      return item;
    } else {
      toast.error("Item isn't updated, please try again.");
    }
  }
);

export const updateItemsThunkReducers = (
  builder: ActionReducerMapBuilder<ItemSliceInitialState>
) => {
  builder
    .addCase(updateItemThunk.pending, (state) => {
      state.itemsStatus = "loading";
    })
    .addCase(updateItemThunk.fulfilled, (state, action) => {
      state.itemsStatus = "succeeded";
      const idx = state.items.findIndex((i) => i.sku === action.payload.sku);
      const newItems = state.items;
      newItems[idx] = action.payload;
      state.items = newItems;
      //console.log(action.payload, newItems, "M<<<");
    })
    .addCase(updateItemThunk.rejected, (state, action) => {
      state.itemsStatus = "failed";
      state.itemsError = action.error.message;
    });
};
