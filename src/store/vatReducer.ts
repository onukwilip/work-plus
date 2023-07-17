import { AnyAction, createSlice } from "@reduxjs/toolkit";
import { VATType, VATReducerType } from "../../types";
import { Dispatch } from "react";
import { vatActions } from "./store";

const initialState: VATReducerType = {
  vat: [],
  fetching: true,
  editing: false,
  deleting: false,
};
const vatSlice = createSlice({
  name: "vat",
  initialState,
  reducers: {
    fetchVAT: (store, { payload }: { payload: VATType[] }) => {
      store.vat = [...payload];
    },
    editVAT: (store, { payload }: { payload: VATType }) => {
      const vatToUpdateIndex = store.vat.findIndex(
        (vat) => vat.id === payload.id
      );
      if (vatToUpdateIndex >= 0) {
        store.vat[vatToUpdateIndex] = { ...payload };
      }
      console.log("VAT INDEX", vatToUpdateIndex);
    },
    deleteVAT: (store, { payload: id }: { payload: string }) => {
      store.vat = store.vat.filter((vat) => vat.id !== id);
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

export const fetchVATAction = () => {
  const fetchVAT = async (dispatch: Dispatch<AnyAction>) => {
    return new Promise<{ data: VATType[] }>((resolve, reject) => {
      // SET FETCHING STATE TO TRUE
      dispatch(
        vatActions.toogleLoadingState({
          state: true,
          property: "fetching",
        })
      );
      setTimeout(async () => {
        const data = await import("../utils/data.json").catch((e) => reject(e));
        if (data) {
          // SET FETCHING STATE TO FALSE
          dispatch(
            vatActions.toogleLoadingState({
              state: false,
              property: "fetching",
            })
          );
          resolve({ data: data.vat });
        }
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const response = await fetchVAT(dispatch).catch((e) => undefined);
    if (response) {
      dispatch(vatActions.fetchVAT(response.data));
    }
  };
};

export const editVATAction = (vat: VATType, onFinishEditing?: Function) => {
  console.log("ACTION CALLED");

  const editVAT = async (dispatch: Dispatch<AnyAction>) => {
    return new Promise<boolean>((resolve, reject) => {
      // SET EDITING STATE TO TRUE
      dispatch(
        vatActions.toogleLoadingState({
          state: true,
          property: "editing",
        })
      );
      setTimeout(() => {
        // SET EDITING STATE TO FALSE
        dispatch(
          vatActions.toogleLoadingState({
            state: false,
            property: "editing",
          })
        );
        resolve(true);
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const status = await editVAT(dispatch);
    if (status) {
      dispatch(vatActions.editVAT(vat));
      onFinishEditing ? onFinishEditing() : null;
    }
  };
};

export const deleteVATAction = (id: string, onFinishDeleting?: Function) => {
  console.log("ACTION CALLED");

  const deleteVAT = async (dispatch: Dispatch<AnyAction>) => {
    // SET DELETING STATE TO TRUE
    dispatch(
      vatActions.toogleLoadingState({
        state: true,
        property: "deleting",
      })
    );
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        // SET DELETING STATE TO FALSE
        dispatch(
          vatActions.toogleLoadingState({
            state: false,
            property: "deleting",
          })
        );
        resolve(true);
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const status = await deleteVAT(dispatch);
    if (status) {
      dispatch(vatActions.deleteVAT(id));
      onFinishDeleting && onFinishDeleting();
    }
  };
};

export default vatSlice;
