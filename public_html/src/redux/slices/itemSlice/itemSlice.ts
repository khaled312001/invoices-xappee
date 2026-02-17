import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchPaginatedItemsThunkReducer } from "./thunks/fetchPaginatedItemsThunk";
import { deleteItemThunkReducers } from "./thunks/deleteItemThunk";
import { fetchItemSearchQueryThunkreducers } from "./thunks/fetchItemSearchQueryThunk";
import { updateItemsThunkReducers } from "./thunks/updateItemThunk";
import { newItemsThunkkReducers } from "./thunks/newItemsThunk";

export interface ItemSliceInitialState {
  items: any[];
  page: number;
  itemsStatus: "idle" | "loading" | "succeeded" | "failed";
  itemsError?: string | undefined;
  uploadedFile?: File | undefined;
}

const initialState: ItemSliceInitialState = {
  items: [],
  page: 1,
  itemsStatus: "idle",
  itemsError: undefined,
  uploadedFile: undefined,
};

export const itemslice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setInitialState: (state, action: PayloadAction<any>) => {
      state.items = action.payload.initialItems;
      state.page = action.payload.nextPage;
    },
    setLoadeing: (state, action: PayloadAction<"loading" | "idle">) => {
      state.itemsStatus = action.payload;
    },
    setUploadedFile: (state, action: PayloadAction<File>) => {
      state.uploadedFile = action.payload;
    },
    setItemsFromCsv: (state, action: PayloadAction<any>) => {
      state.items = [...state.items, ...action.payload];
      state.uploadedFile = undefined;
    },
  },
  extraReducers(builder) {
    fetchPaginatedItemsThunkReducer(builder);
    deleteItemThunkReducers(builder);
    fetchItemSearchQueryThunkreducers(builder);
    updateItemsThunkReducers(builder);
    newItemsThunkkReducers(builder);
  },
});
