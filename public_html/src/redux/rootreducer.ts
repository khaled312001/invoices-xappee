import { itemslice } from "./slices/itemSlice/itemSlice";
import { orderSlice } from "./slices/orderSlice/orderSlice";
import { storageInvoiceSlice } from "./slices/storageInvoiceSlice/storageInvoiceSlice";

export const rootReducers = {
  order: orderSlice.reducer,
  item: itemslice.reducer,
  storageInvoice: storageInvoiceSlice.reducer,
};
