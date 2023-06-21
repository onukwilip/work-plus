import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalReducer";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
  },
});

export const modalActions = modalSlice.actions;
export default store;
