import { createSlice } from "@reduxjs/toolkit";
import { generateStorageInvoiceThunkReducers } from "./thunks/generateStorageInvoiceThunk";
export interface StorageInvoiceInitialState {
  invoice: any | undefined;
  invoiceStatus: "idle" | "loading" | "succeeded" | "failed";
  invoiceError?: string | undefined;
}

const initialState: StorageInvoiceInitialState = {
  invoice: undefined,
  invoiceStatus: "idle",
  invoiceError: undefined,
};

export const storageInvoiceSlice = createSlice({
  name: "storageInvoice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    generateStorageInvoiceThunkReducers(builder);
  },
});
