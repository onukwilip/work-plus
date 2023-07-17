import { materials } from "@/utils/data.json";
import { AnyAction, createSlice } from "@reduxjs/toolkit";
import { MaterialType, MaterialsReducerType } from "../../types";
import { Dispatch } from "react";
import { materialActions } from "./store";

const initialState: MaterialsReducerType = {
  materials: [],
  fetching: true,
  editing: false,
  deleting: false,
};
const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    fetchMaterials: (store, { payload }: { payload: MaterialType[] }) => {
      store.materials = [...payload];
    },
    editMaterial: (store, { payload }: { payload: MaterialType }) => {
      const materialToUpdateIndex = store.materials.findIndex(
        (material) => material.id === payload.id
      );
      if (materialToUpdateIndex >= 0) {
        store.materials[materialToUpdateIndex] = { ...payload };
      }
      console.log("MATERIAL INDEX", materialToUpdateIndex);
    },
    deleteMaterial: (store, { payload: id }: { payload: string }) => {
      store.materials = store.materials.filter(
        (material) => material.id !== id
      );
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

export const fetchMaterialsAction = () => {
  const fetchMaterials = async (dispatch: Dispatch<AnyAction>) => {
    return new Promise<{ data: MaterialType[] }>((resolve, reject) => {
      // SET FETCHING STATE TO TRUE
      dispatch(
        materialActions.toogleLoadingState({
          state: true,
          property: "fetching",
        })
      );
      setTimeout(async () => {
        const data = await import("../utils/data.json").catch((e) => reject(e));
        if (data) {
          // SET FETCHING STATE TO FALSE
          dispatch(
            materialActions.toogleLoadingState({
              state: false,
              property: "fetching",
            })
          );
          resolve({ data: data.materials });
        }
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const response = await fetchMaterials(dispatch).catch((e) => undefined);
    if (response) {
      dispatch(materialActions.fetchMaterials(response.data));
    }
  };
};

export const editMaterialAction = (
  material: MaterialType,
  onFinishEditing?: Function
) => {
  console.log("ACTION CALLED");

  const editMaterial = async (dispatch: Dispatch<AnyAction>) => {
    return new Promise<boolean>((resolve, reject) => {
      // SET EDITING STATE TO TRUE
      dispatch(
        materialActions.toogleLoadingState({
          state: true,
          property: "editing",
        })
      );
      setTimeout(() => {
        // SET EDITING STATE TO FALSE
        dispatch(
          materialActions.toogleLoadingState({
            state: false,
            property: "editing",
          })
        );
        resolve(true);
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const status = await editMaterial(dispatch);
    if (status) {
      dispatch(materialActions.editMaterial(material));
      onFinishEditing ? onFinishEditing() : null;
    }
  };
};

export const deleteMaterialAction = (
  id: string,
  onFinishDeleting?: Function
) => {
  console.log("ACTION CALLED");

  const deleteMaterial = async (dispatch: Dispatch<AnyAction>) => {
    // SET DELETING STATE TO TRUE
    dispatch(
      materialActions.toogleLoadingState({
        state: true,
        property: "deleting",
      })
    );
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        // SET DELETING STATE TO FALSE
        dispatch(
          materialActions.toogleLoadingState({
            state: false,
            property: "deleting",
          })
        );
        resolve(true);
      }, 3000);
    });
  };

  return async (dispatch: Dispatch<AnyAction>) => {
    const status = await deleteMaterial(dispatch);
    if (status) {
      dispatch(materialActions.deleteMaterial(id));
      onFinishDeleting && onFinishDeleting();
    }
  };
};

export default materialSlice;
