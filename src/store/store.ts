import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalReducer";
import customerSlice from "./customersReducer";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    customers: customerSlice.reducer,
  },
});

export const modalActions = modalSlice.actions;
export const customerActions = customerSlice.actions;
export default store;
