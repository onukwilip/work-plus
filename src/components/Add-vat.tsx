"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import css from "@/styles/Add-vat.module.scss";
import { Button, Form, Icon } from "semantic-ui-react";
import Input, { ImgUpload } from "./Input";
import { useForm, useInput } from "use-manage-form";

const AddVAT = () => {
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
    value: amount,
    isValid: amountIsValid,
    inputIsInValid: amountIsInValid,
    onChange: onAmountChange,
    onBlur: onAmountBlur,
    reset: resetAmount,
  } = useInput<string>((value) => !isNaN(Number(value)) && Number(value) > 0);

  const { executeBlurHandlers, reset, formIsValid } = useForm({
    blurHandlers: [onDescriptionBlur, onAmountBlur],
    resetHandlers: [resetAmount, resetDescription],
    validateOptions: () => descriptionIsValid && amountIsValid,
  });

  const submitHandler = (e: FormEvent) => {
    if (!formIsValid) return executeBlurHandlers();

    console.log(description, amount);
    reset();
  };

  const onResetHandler = () => {
    reset();
  };

  return (
    <section className={css["add-vat"]}>
      <h3>Add VAT</h3>
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
              onChange={(e) => onAmountChange(e?.target?.value)}
              onBlur={onAmountBlur as any}
              value={amount}
              name="amount"
              type="number"
              placeholder="Enter amount"
              id="amount"
              error={
                amountIsInValid && {
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

export default AddVAT;
