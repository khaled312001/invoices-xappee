import { fetchOrdersThunkReducers } from "./thunks/fetchOrdersthunk";
import { softDeleteOrderThunkReducers } from "./thunks/softDeleteOrderThunk";

import { restoreOrderThunkReucers } from "./thunks/restoreOrderThunk";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { appendOrdersThunkReducers } from "./thunks/appendOrdersThunk";
import { fixOneOrderThunkReducers } from "./thunks/fixOneOrderThunk";
import { generateFulfullmentInvoiceThunkReducers } from "./thunks/generateFulfullmentInvoiceThunk";
import { fetchCarriersThunkReducers } from "./thunks/fetchCarriersThunk";
import { DateRange } from "react-day-picker";
import { updateShippingInfoThunkReducers } from "./thunks/updateShippingInfoThunk";

export interface OrderSliceInitialState {
  orders: any[];
  ordersStatus: "idle" | "loading" | "succeeded" | "failed";
  ordersError?: string | undefined;
  ordersCount?: number;
  ordersTrash: any[];
  invoice: any | undefined;
  carriers: any[];
  carrierStatus: "idle" | "loading" | "succeeded" | "failed";
  fulfillmentView: "orders" | "invoice" | undefined;
  uploadedFile?: File | undefined;
  uploadedFileOrdersMetaData:
    | {
        dateRange: DateRange;
        channels: {
          channel: string;
          channelName: string;
        }[];
      }
    | undefined;
}

const initialState: OrderSliceInitialState = {
  orders: [],
  ordersStatus: "idle",
  ordersError: undefined,
  ordersCount: 0,
  ordersTrash: [],
  invoice: undefined,
  carriers: [],
  carrierStatus: "idle",
  fulfillmentView: "orders",
  uploadedFile: undefined,
  uploadedFileOrdersMetaData: {
    dateRange: { from: new Date(), to: new Date() },
    channels: [],
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    filterOrders: (state, action: PayloadAction<any[]>) => {
      state.ordersTrash = state.orders.filter(
        (o) => !action.payload.includes(o.id)
      );
      state.orders = state.orders.filter((o) => action.payload.includes(o.id));
    },
    restoreOrders: (state) => {
      state.orders = [...state.orders, ...state.ordersTrash];
      state.ordersTrash = [];
    },
    toggleFulfillmentView: (
      state,
      action: PayloadAction<"orders" | "invoice" | undefined>
    ) => {
      state.fulfillmentView = action.payload;
    },
    setLoadeing: (state, action: PayloadAction<"loading" | "idle">) => {
      state.ordersStatus = action.payload;
    },
    updateShippingInfo: (state, action: PayloadAction<any>) => {
      state.orders = state.orders.map((o) =>
        o.id === action.payload.id ? { ...o, ...action.payload.values } : o
      );
    },
    setCarriers: (state, action: PayloadAction<any[]>) => {
      if (action.payload.length > 0) {
        state.carriers = action.payload;
        state.carrierStatus = "succeeded";
      }
    },
    setUploadedFile: (state, action: PayloadAction<File | undefined>) => {
      state.uploadedFile = action.payload;
    },
    discardFile: (state) => {
      state.uploadedFile = undefined;
      state.uploadedFileOrdersMetaData = {
        dateRange: { from: new Date(), to: new Date() },
        channels: [],
      };
      state.orders = [];
      state.ordersCount = 0;
      state.invoice = undefined;
    },
    setOrdersFromCsv: (state, action: PayloadAction<any>) => {
      state.orders = action.payload.orders || [];
      state.ordersCount = action.payload?.orders.length as number;
      state.uploadedFileOrdersMetaData.dateRange = action.payload.dateRange;
      state.uploadedFileOrdersMetaData.channels = action.payload.channels;
      state.invoice = undefined;
    },
  },
  extraReducers(builder) {
    fetchOrdersThunkReducers(builder);
    softDeleteOrderThunkReducers(builder);
    restoreOrderThunkReucers(builder);
    appendOrdersThunkReducers(builder);
    fixOneOrderThunkReducers(builder);
    generateFulfullmentInvoiceThunkReducers(builder);
    fetchCarriersThunkReducers(builder);
    updateShippingInfoThunkReducers(builder);
  },
});
