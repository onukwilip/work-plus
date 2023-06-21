import { createSlice } from "@reduxjs/toolkit";

const initialState = { customers: [] };
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
});

export default customerSlice;
