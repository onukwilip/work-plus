"use client";

import { modalActions } from "@/store/store";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { VATType, SelectorType } from "../../types";
import { useForm, useInput } from "use-manage-form";
import Input from "./Input";
import css from "@/styles/EditVAT.module.scss";
import { editVATAction } from "@/store/vatReducer";
import { AnyAction } from "redux";

type EditVATPropsType = { vat: VATType };

const EditVAT: FC<EditVATPropsType> = ({ vat }) => {
  // HOOKS
  const dispatch = useDispatch();
  const editingVAT: boolean = useSelector<SelectorType>(
    (state) => state.vat.editing
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
        component: EditVAT as FC<unknown>,
        properties: { vat },
      })
    );
  };
  const closeModal = () => {
    dispatch(modalActions.hide());
  };
  const updateVAT = () => {
    if (!formIsValid) return executeBlurHandlers();

    const editedVAT: VATType = {
      id: vat.id,
      description: description || vat.description,
      ["unit price"]: (unitPrice && Number(unitPrice)) || vat["unit price"],
    };

    // UPDATE THE CUSTOMER
    dispatch(
      editVATAction(editedVAT, () => {
        reset();
        closeModal();
      }) as unknown as AnyAction
    );

    console.log(description, unitPrice);
  };

  useEffect(() => {
    onDescriptionChange(vat.description?.toString());
    onUnitPriceChange(vat?.["unit price"]?.toString());
    executeBlurHandlers();
  }, []);

  return (
    <>
      <Modal
        onClose={closeModal}
        onOpen={displayModal}
        className={css["edit-vat"]}
        open={true}
        dimmer="blurring"
      >
        <>
          <Modal.Header>Edit {vat.description}</Modal.Header>
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
              content={editingVAT ? "Updating..." : "Update"}
              onClick={updateVAT}
              disabled={editingVAT}
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

export default EditVAT;
