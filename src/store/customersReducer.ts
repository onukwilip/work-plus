import { customers } from "@/utils/data.json";
import { AnyAction, createSlice } from "@reduxjs/toolkit";
import { CustomerReducerType, CustomerType } from "../../types";
import { Dispatch } from "react";
import { customerActions } from "./store";

const initialState: CustomerReducerType = {
  customers: [],
  fetching: true,
  editing: false,
  deleting: false,
};
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    fetchCustomers: (store, { payload }: { payload: CustomerType[] }) => {
      store.customers = [...payload];
    },
    editCustomer: (store, { payload }: { payload: CustomerType }) => {
      const customerToUpdateIndex = store.customers.findIndex(
        (customer) => customer.id === payload.id
      );
      if (customerToUpdateIndex > 0) {
        store.customers[customerToUpdateIndex] = { ...payload };
      }
      console.log("CUSTOMER INDEX", customerToUpdateIndex);
    },
    deleteCustomer: (store, { payload: id }: { payload: string }) => {
      store.customers.filter((customer) => customer.id !== id);
    },
    toogleLoadingState: (
      store,
      {
        payload,
      }: {
        payload: {
          state: boolean;
          property: "fetching" | "editing" | "deleting";
        };
      }
    ) => {
      store[payload.property] = payload.state;
    },
  },
});

export const fetchCustomersAction = () => {
  const fetchCustomers = async (dispatch: Dispatch<AnyAction>) => {
    return new Promise<{ data: CustomerType[] }>((resolve, reject) => {
      // SET FETCHING STATE TO TRUE
      dispatch(
        customerActions.toogleLoadingState({
          state: true,
          property: "fetching",
        })
      );
      setTimeout(async () => {
        const data = await import("../utils/data.json").catch((e) => reject(e));
        if (data) {
          // SET FETCHING STATE TO FALSE
          dispatch(
            customerActions.toogleLoadingState({
              state: false,
              property: "fetching",
            })
          );
          resolve({ data: data.customers });
        }
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const response = await fetchCustomers(dispatch).catch((e) => undefined);
    if (response) {
      dispatch(customerActions.fetchCustomers(response.data));
    }
  };
};

export const editCustomerAction = (customer: CustomerType) => {
  console.log("ACTION CALLED");

  const editCustomer = async (dispatch: Dispatch<AnyAction>) => {
    return new Promise<boolean>((resolve, reject) => {
      // SET EDITING STATE TO TRUE
      dispatch(
        customerActions.toogleLoadingState({
          state: true,
          property: "editing",
        })
      );
      setTimeout(() => {
        // SET EDITING STATE TO FALSE
        dispatch(
          customerActions.toogleLoadingState({
            state: false,
            property: "editing",
          })
        );
        resolve(true);
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const status = await editCustomer(dispatch);
    if (status) dispatch(customerActions.editCustomer(customer));
  };
};

export const deleteCustomerAction = (id: string) => {
  const deleteCustomer = async (dispatch: Dispatch<AnyAction>) => {
    // SET DELETING STATE TO TRUE
    dispatch(
      customerActions.toogleLoadingState({
        state: true,
        property: "deleting",
      })
    );
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        // SET DELETING STATE TO FALSE
        dispatch(
          customerActions.toogleLoadingState({
            state: false,
            property: "deleting",
          })
        );
        resolve(true);
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const status = await deleteCustomer(dispatch);
    if (status) dispatch(customerActions.deleteCustomer(id));
  };
};

export default customerSlice;
