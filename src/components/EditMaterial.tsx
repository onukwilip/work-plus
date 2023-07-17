"use client";

import { modalActions } from "@/store/store";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { MaterialType, SelectorType } from "../../types";
import { useForm, useInput } from "use-manage-form";
import Input from "./Input";
import css from "@/styles/EditMaterial.module.scss";
import { editMaterialAction } from "@/store/materialsReducer";
import { AnyAction } from "redux";

type EditMaterialPropsType = { material: MaterialType };

const EditMaterial: FC<EditMaterialPropsType> = ({ material }) => {
  // HOOKS
  const dispatch = useDispatch();
  const editingMaterial: boolean = useSelector<SelectorType>(
    (state) => state.materials.editing
  ) as boolean;
  const {
    value: description,
    isValid: descriptionIsValid,
    inputIsInValid: descriptionIsInValid,
    onChange: onDescriptionChange,
    onBlur: onDescriptionBlur,
    reset: resetDescription,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: unitPrice,
    isValid: unitPriceIsValid,
    inputIsInValid: unitPriceIsInValid,
    onChange: onUnitPriceChange,
    onBlur: onUnitPriceBlur,
    reset: resetUnitPrice,
  } = useInput<string>((value) => !isNaN(Number(value)) && Number(value) > 0);
  const { executeBlurHandlers, reset, formIsValid } = useForm({
    blurHandlers: [onDescriptionBlur, onUnitPriceBlur],
    resetHandlers: [resetUnitPrice, resetDescription],
    validateOptions: () => descriptionIsValid && unitPriceIsValid,
  });
  //FUNCTIONS
  const displayModal = () => {
    dispatch(
      modalActions.display({
        component: EditMaterial as FC<unknown>,
        properties: { material },
      })
    );
  };
  const closeModal = () => {
    dispatch(modalActions.hide());
  };
  const updateMaterial = () => {
    if (!formIsValid) return executeBlurHandlers();

    const editedMaterial: MaterialType = {
      id: material.id,
      description: description || material.description,
      ["unit price"]:
        (unitPrice && Number(unitPrice)) || material["unit price"],
    };

    // UPDATE THE CUSTOMER
    dispatch(
      editMaterialAction(editedMaterial, () => {
        reset();
        closeModal();
      }) as unknown as AnyAction
    );

    console.log(description, unitPrice);
  };

  useEffect(() => {
    onDescriptionChange(material.description?.toString());
    onUnitPriceChange(material?.["unit price"]?.toString());
    executeBlurHandlers();
  }, []);

  return (
    <>
      <Modal
        onClose={closeModal}
        onOpen={displayModal}
        className={css["edit-material"]}
        open={true}
        dimmer="blurring"
      >
        <>
          <Modal.Header>Edit {material.description}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <div className={css.form}>
                <div className={css["input-container"]}>
                  <div>
                    <Input
                      icon="fas fa-circle-info"
                      onChange={(e) => onDescriptionChange(e?.target?.value)}
                      onBlur={onDescriptionBlur as any}
                      value={description}
                      name="description"
                      type="text"
                      placeholder="Enter description"
                      id="description"
                      error={
                        descriptionIsInValid && {
                          content: "Input cannot be empty",
                        }
                      }
                    />
                  </div>
                  <div>
                    <Input
                      icon="fas fa-dollar-sign"
                      onChange={(e) => onUnitPriceChange(e?.target?.value)}
                      onBlur={onUnitPriceBlur as any}
                      value={unitPrice}
                      name="unitPrice"
                      label="unit price"
                      type="number"
                      placeholder="Enter unit price"
                      id="unitPrice"
                      error={
                        unitPriceIsInValid && {
                          content:
                            "Input cannot be empty and must be a number greater than 0",
                        }
                      }
                    />
                  </div>
                </div>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="blue"
              labelPosition="right"
              icon="cloud"
              content={editingMaterial ? "Updating..." : "Update"}
              onClick={updateMaterial}
              disabled={editingMaterial}
            />
            <Button
              content="Cancel"
              labelPosition="right"
              icon="x"
              onClick={closeModal}
              negative
            />
          </Modal.Actions>
        </>
      </Modal>
    </>
  );
};

export default EditMaterial;
