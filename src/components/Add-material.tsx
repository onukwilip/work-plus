"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import css from "@/styles/Add-material.module.scss";
import { Button, Form, Icon } from "semantic-ui-react";
import Input, { ImgUpload } from "./Input";
import { useForm, useInput } from "use-manage-form";

const AddMaterial = () => {
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

  const submitHandler = (e: FormEvent) => {
    if (!formIsValid) return executeBlurHandlers();

    console.log(description, unitPrice);
    reset();
  };

  const onResetHandler = () => {
    reset();
  };

  return (
    <section className={css["add-material"]}>
      <h3>Add Material</h3>
      <Form className={css.form} onSubmit={submitHandler}>
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
                descriptionIsInValid && { content: "Input cannot be empty" }
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
        <div className={css["actions"]}>
          <Button animated="fade" positive type="submit">
            <Button.Content visible>Submit</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
          <Button animated="fade" primary type="reset" onClick={onResetHandler}>
            <Button.Content visible>Reset</Button.Content>
            <Button.Content hidden>
              <i className="fas fa-rotate-right" />
            </Button.Content>
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default AddMaterial;
