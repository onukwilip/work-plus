import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalReducer";
import customerSlice from "./customersReducer";
import materialSlice from "./materialsReducer";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    customers: customerSlice.reducer,
    materials: materialSlice.reducer,
  },
});

export const modalActions = modalSlice.actions;
export const customerActions = customerSlice.actions;
export const materialActions = materialSlice.actions;
export default store;
