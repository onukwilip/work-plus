"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import css from "@/styles/Add-customer.module.scss";
import { Button, Form, Icon } from "semantic-ui-react";
import Input, { ImgUpload } from "./Input";
import { useForm, useInput } from "use-manage-form";

const AddCustomer = () => {
  const validImageExtensions = ["png", "jpg", "jpeg", "webp"];
  const [resetImageValue, setResetImage] = useState(true);
  const {
    value: fullname,
    isValid: nameIsValid,
    inputIsInValid: nameIsInValid,
    onChange: onNameChange,
    onBlur: onNameBlur,
    reset: resetName,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: address,
    isValid: addressIsValid,
    inputIsInValid: addressIsInValid,
    onChange: onAddressChange,
    onBlur: onAddressBlur,
    reset: resetAddress,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: phone,
    isValid: phoneIsValid,
    inputIsInValid: phoneIsInValid,
    onChange: onPhoneChange,
    onBlur: onPhoneBlur,
    reset: resetPhone,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: email,
    isValid: emailIsValid,
    inputIsInValid: emailIsInValid,
    onChange: onEmailChange,
    onBlur: onEmailBlur,
    reset: resetEmail,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value?.includes("@") || false)
  );

  const {
    value: image,
    isValid: imageIsValid,
    inputIsInValid: imageIsInvalid,
    onChange: onImageChange,
    onBlur: onImageBlur,
    reset: resetImage,
  } = useInput<File>((value) =>
    value
      ? validImageExtensions.includes(value?.name?.split(".")?.pop() || "")
      : true
  );

  const { executeBlurHandlers, reset, formIsValid } = useForm({
    blurHandlers: [
      onImageBlur,
      onNameBlur,
      onAddressBlur,
      onPhoneBlur,
      onEmailBlur,
    ],
    resetHandlers: [
      resetAddress,
      resetEmail,
      resetName,
      resetPhone,
      () => {
        setResetImage((prev) => !prev);
      },
    ],
    validateOptions: () =>
      nameIsValid &&
      emailIsValid &&
      addressIsValid &&
      phoneIsValid &&
      imageIsValid,
  });

  const submitHandler = (e: FormEvent) => {
    if (!formIsValid) return executeBlurHandlers();

    console.log(fullname, address, email, phone, image);
    reset();
  };

  const onResetHandler = () => {
    reset();
  };

  return (
    <section className={css["add-customer"]}>
      <h3>Add Customer</h3>
      <Form className={css.form} onSubmit={submitHandler}>
        <div className={css["input-container"]}>
          <div>
            <ImgUpload
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onImageChange(e?.target?.files?.[0])
              }
              triggerReset={resetImageValue}
              value={image}
            />
          </div>
          <div>
            <Input
              icon="icon user"
              onChange={(e) => onNameChange(e?.target?.value)}
              onBlur={onNameBlur as any}
              value={fullname}
              name="name"
              label="Name"
              type="text"
              placeholder="Enter fullname"
              id="username"
              error={nameIsInValid && { content: "Input cannot be empty" }}
            />
            <Input
              icon="icon user"
              onChange={(e) => onAddressChange(e?.target?.value)}
              onBlur={onAddressBlur as any}
              value={address}
              name="address"
              label="Address"
              type="text"
              placeholder="Enter address"
              id="address"
              error={addressIsInValid && { content: "Input cannot be empty" }}
            />
          </div>
          <div>
            <Input
              icon="icon phone"
              onChange={(e) => onPhoneChange(e?.target?.value)}
              onBlur={onPhoneBlur as any}
              value={phone}
              name="phone"
              label="Phone number"
              type="tel"
              placeholder="Enter phone number"
              id="phone"
              error={
                phoneIsInValid && {
                  content: "Input cannot be empty",
                  position: { right: "0" },
                }
              }
            />
            <Input
              icon="icon mail"
              onChange={(e) => onEmailChange(e?.target?.value)}
              onBlur={onEmailBlur as any}
              value={email}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email"
              id="email"
              error={
                emailIsInValid && {
                  content: "Input cannot be empty and must be a valid email",
                  position: { right: "0" },
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

export default AddCustomer;
