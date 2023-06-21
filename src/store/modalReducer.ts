import { createSlice } from "@reduxjs/toolkit";
import { FC } from "react";
import { ModalPayload, ModalType } from "../../types";

const initialState: ModalType = {
  show: false,
  props: { component: undefined, properties: {} },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    display<T>(store: ModalType, { payload }: { payload: ModalPayload<T> }) {
      store.show = true;
      store.props.component = payload.component;
      store.props.properties = payload.properties as Record<string, any>;
    },
    hide(state) {
      state.show = false;
    },
  },
});

export default modalSlice;
