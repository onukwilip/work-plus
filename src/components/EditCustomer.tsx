"use client";

import { modalActions } from "@/store/store";
import React, { ChangeEvent, FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  CardContent,
  CardDescription,
  CommentActions,
  Header,
  Icon,
  Image,
  Modal,
} from "semantic-ui-react";
import { CustomerReducerType, CustomerType, SelectorType } from "../../types";
import { useForm, useInput } from "use-manage-form";
import Input, { ImgUpload } from "./Input";
import css from "@/styles/EditCustomer.module.scss";
import { editCustomerAction } from "@/store/customersReducer";
import { AnyAction } from "redux";

type EditCustomerPropsType = { customer: CustomerType };

const EditCustomer: FC<EditCustomerPropsType> = ({ customer }) => {
  // HOOKS
  const dispatch = useDispatch();
  const editingCustomer: boolean = useSelector<SelectorType>(
    (state) => state.customers.editing
  ) as boolean;
  const validImageExtensions = ["png", "jpg", "jpeg", "webp"];
  const [resetImageValue, setResetImage] = useState(true);
  const [initialImage, setInitialImage] = useState(customer?.image);
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
      () => setResetImage((prev) => !prev),
      () => setInitialImage(undefined),
    ],
    validateOptions: () =>
      nameIsValid &&
      emailIsValid &&
      addressIsValid &&
      phoneIsValid &&
      imageIsValid,
  });

  //FUNCTIONS
  const displayModal = () => {
    dispatch(
      modalActions.display({
        component: EditCustomer as FC<unknown>,
        properties: { customer },
      })
    );
  };
  const closeModal = () => {
    dispatch(modalActions.hide());
  };
  const updateCustomer = () => {
    if (!formIsValid) return executeBlurHandlers();

    const editedCustomer: CustomerType = {
      id: customer.id,
      name: fullname || customer.name,
      email: email || customer.email,
      phone: phone || customer.phone,
      image: image ? URL.createObjectURL(image) : customer.image,
      address: address || customer.address,
    };

    // UPDATE THE CUSTOMER
    dispatch(
      editCustomerAction(editedCustomer, () => {
        reset();
        closeModal();
      }) as unknown as AnyAction
    );

    console.log(fullname, address, email, phone, image);
  };

  useEffect(() => {
    onNameChange(customer.name?.toString());
    onAddressChange(customer.address?.toString());
    onEmailChange(customer.email?.toString());
    onPhoneChange(customer.phone?.toString());
    executeBlurHandlers();
  }, []);

  return (
    <>
      <Modal
        onClose={closeModal}
        onOpen={displayModal}
        className={css["edit-customer"]}
        open={true}
        dimmer="blurring"
      >
        <>
          <Modal.Header>Edit {customer.name}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <div className={css.form}>
                <div className={css["input-container"]}>
                  <div>
                    <ImgUpload
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onImageChange(e?.target?.files?.[0])
                      }
                      triggerReset={resetImageValue}
                      value={image}
                      initialImage={initialImage}
                      removeInitialImage={() => setInitialImage(undefined)}
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
                      error={
                        nameIsInValid && { content: "Input cannot be empty" }
                      }
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
                      error={
                        addressIsInValid && { content: "Input cannot be empty" }
                      }
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
                          content:
                            "Input cannot be empty and must be a valid email",
                          position: { right: "0" },
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
              content={editingCustomer ? "Updating..." : "Update"}
              onClick={updateCustomer}
              disabled={editingCustomer}
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

export default EditCustomer;
