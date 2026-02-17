import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { ItemSliceInitialState } from "../itemSlice";
import { deleteItem } from "@/lib/services/item.service";
import { toast } from "sonner";

export const delteItemThunk = createAsyncThunk(
  "items/deleteItemThunk",
  async (_id: string) => {
    try {
      const isDeleted = await deleteItem(_id);
      if (isDeleted) {
        toast.success(`Item deleted succesfully.`);
        return _id;
      } else {
        toast.error(`Can't delete item, please try again.`);
      }
    } catch (err: any) {
      toast.error(`Can't delete item, please try again. | ${err.message}`);
    }
  }
);

export const deleteItemThunkReducers = (
  builder: ActionReducerMapBuilder<ItemSliceInitialState>
) => {
  builder
    .addCase(delteItemThunk.pending, (state) => {
      state.itemsStatus = "loading";
    })
    .addCase(delteItemThunk.fulfilled, (state, action) => {
      state.itemsStatus = "succeeded";
      state.items = state.items.filter((i) => i._id !== action.payload);
    })
    .addCase(delteItemThunk.rejected, (state, action) => {
      state.itemsStatus = "failed";
      state.itemsError = action.error.message;
    });
};
