import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { StorageInvoiceInitialState } from "../storageInvoiceSlice";
import { generateStorageInvoice } from "@/lib/services/invoice.service";
import { revalidateClientInvoices } from "@/lib/actions/revalidateTag";

export const generateStorageInvoiceThunk = createAsyncThunk(
  "orders/generateStorageInvoiceThunk",
  async (data: any) => {
    try {
     const invoice = await generateStorageInvoice(data);
      if (invoice) {
        await revalidateClientInvoices();
        toast.success("invoice generated successfuly");
        return invoice;
      } else {
        toast.error(`something went wrong, please try again later`);
      }
    } catch (err: any) {
      toast.error(`something went wrong, ${err}`);
    }
  }
);

export const generateStorageInvoiceThunkReducers = (
  builder: ActionReducerMapBuilder<StorageInvoiceInitialState>
) => {
  builder
    .addCase(generateStorageInvoiceThunk.pending, (state) => {
      state.invoiceStatus = "loading";
    })
    .addCase(generateStorageInvoiceThunk.fulfilled, (state, action) => {
      state.invoiceStatus = "succeeded";
      state.invoice = action.payload;
    })
    .addCase(generateStorageInvoiceThunk.rejected, (state, action) => {
      state.invoiceStatus = "failed";
      state.invoiceError = action.error.message;
    });
};
