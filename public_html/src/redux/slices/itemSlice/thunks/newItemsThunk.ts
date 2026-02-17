import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { ItemSliceInitialState } from "../itemSlice";
import {
  deleteItem,
  postNewItem,
  postNewItems,
} from "@/lib/services/item.service";
import { toast } from "sonner";

export const newItemsThunk = createAsyncThunk(
  "items/newItemsThunk",
  async (items: any[] | any) => {
    try {
      if (items.length > 1) {
        const addedIems = await postNewItems(items);
        if (addedIems) {
          toast.success(`${addedIems.length} items added successfuly`);
          return addedIems;
        }
      } else {
        const addedItem = await postNewItem(items[0]);
        if (addedItem) {
          toast.success(`item added successfuly`);
          return addedItem;
        }
      }
    } catch (err: any) {
      toast.error(`Can't add Item(s). | ${err.message}`);
    }
  }
);

export const newItemsThunkkReducers = (
  builder: ActionReducerMapBuilder<ItemSliceInitialState>
) => {
  builder
    .addCase(newItemsThunk.pending, (state) => {
      state.itemsStatus = "loading";
    })
    .addCase(newItemsThunk.fulfilled, (state, action) => {
      state.itemsStatus = "succeeded";
      if (action.payload.length > 1) {
        state.items.push(...action.payload);
      } else {
        state.items.push(action.payload);
      }
    })
    .addCase(newItemsThunk.rejected, (state, action) => {
      state.itemsStatus = "failed";
      state.itemsError = action.error.message;
    });
};
