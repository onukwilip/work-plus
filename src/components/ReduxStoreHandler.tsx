"use client";

import store from "@/store/store";
import React from "react";
import { Provider } from "react-redux";

const ReduxStoreHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
};

export default ReduxStoreHandler;
