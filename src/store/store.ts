import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalReducer";
import customerSlice from "./customersReducer";
import materialSlice from "./materialsReducer";
import vatSlice from "./vatReducer";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    customers: customerSlice.reducer,
    materials: materialSlice.reducer,
    vat: vatSlice.reducer,
  },
});

export const modalActions = modalSlice.actions;
export const customerActions = customerSlice.actions;
export const materialActions = materialSlice.actions;
export const vatActions = vatSlice.actions;
export default store;
