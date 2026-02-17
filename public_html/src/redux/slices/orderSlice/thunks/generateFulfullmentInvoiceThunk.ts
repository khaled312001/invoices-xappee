import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { OrderSliceInitialState } from "../orderSlice";
import { generateFulfillmentInvoice } from "@/lib/services/invoice.service";
import { toast } from "sonner";

export const generateFulfullmentInvoiceThunk = createAsyncThunk(
  "orders/generateFulfullmentInvoiceThunk",
  async (data: any) => {
    try {
      const { orders, range, channels, clientName, expenseCause , expenseValue } = data;

      const invoiceData = await generateFulfillmentInvoice(
        orders,
        channels,
        clientName,
        range,
        expenseCause,
        expenseValue
      );

      if (invoiceData.error) {
        toast.error(invoiceData.message || "Something went wrong.");
        return isRejectedWithValue(invoiceData.error);
      } else {
        return invoiceData;
      }
    } catch (err) {
      console.error(err);
      return isRejectedWithValue(err.message);
    }
  }
);
export const generateFulfullmentInvoiceThunkReducers = (
  builder: ActionReducerMapBuilder<OrderSliceInitialState>
) => {
  builder
    .addCase(generateFulfullmentInvoiceThunk.pending, (state) => {
      state.ordersStatus = "loading";
    })
    .addCase(generateFulfullmentInvoiceThunk.fulfilled, (state, action) => {
      state.ordersStatus = "succeeded";
      state.invoice = action.payload;
      state.fulfillmentView = "invoice";
    })
    .addCase(generateFulfullmentInvoiceThunk.rejected, (state, action) => {
      state.ordersStatus = "failed";
      state.ordersError = action.error.message;
      toast.error(action.error.message || "Something went wrong.");
    });
};
