"use client";
import React, { useEffect, useState } from "react";
import css from "@/styles/CreateOrder.module.scss";
import {
  DropdownItemProps,
  DropdownProps,
  Form,
  Image,
  Message,
} from "semantic-ui-react";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { CustomerReducerType, CustomerType, SelectorType } from "../../types";
import { fetchCustomersAction } from "@/store/customersReducer";
import { AnyAction } from "redux";
import { useInput } from "use-manage-form";

const CreateOrder = () => {
  const customers: CustomerReducerType = useSelector<SelectorType>(
    (state) => state.customers
  ) as CustomerReducerType;
  const [customerOptions, setCustomerOptions] = useState<DropdownItemProps[]>(
    []
  );
  const [customerDetails, setCustomerDetails] = useState<
    CustomerType | undefined
  >();
  const dispatch = useDispatch();
  // INPUTS
  const {
    value: jobNumber,
    isValid: jobNumberIsValid,
    inputIsInValid: jobNumberInputIsInvalid,
    onChange: onJobNumberChnage,
    onBlur: onJobNumberBlur,
    reset: resetJobNumber,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: dateReceived,
    isValid: dateReceivedIsValid,
    inputIsInValid: dateReceivedInputIsInvalid,
    onChange: onDateReceivedChnage,
    onBlur: onDateReceivedBlur,
    reset: resetDateReceived,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: dateToBeCompleted,
    isValid: dateToBeCompletedIsValid,
    inputIsInValid: dateToBeCompletedInputIsInvalid,
    onChange: onDateToBeCompletedChnage,
    onBlur: onDateToBeCompletedBlur,
    reset: resetDateToBeCompleted,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: instructionTakenBy,
    isValid: instructionTakenByIsValid,
    inputIsInValid: instructionTakenByInputIsInvalid,
    onChange: onInstructionTakenByChnage,
    onBlur: onInstructionTakenByBlur,
    reset: resetInstructionTakenBy,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: jobDoneBy,
    isValid: jobDoneByIsValid,
    inputIsInValid: jobDoneByInputIsInvalid,
    onChange: onJobDoneByChnage,
    onBlur: onJobDoneByBlur,
    reset: resetJobDoneBy,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: timeStarted,
    isValid: timeStartedIsValid,
    inputIsInValid: timeStartedInputIsInvalid,
    onChange: onTimeStartedChnage,
    onBlur: onTimeStartedBlur,
    reset: resetTimeStarted,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: timeCompleted,
    isValid: timeCompletedIsValid,
    inputIsInValid: timeCompletedInputIsInvalid,
    onChange: onTimeCompletedChnage,
    onBlur: onTimeCompletedBlur,
    reset: resetTimeCompleted,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );

  const onCustomerChange = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    const details = customers.customers.find(
      (customer) => customer.email === data.value
    );
    setCustomerDetails(details);
  };

  useEffect(() => {
    dispatch(fetchCustomersAction() as unknown as AnyAction);
  }, []);
  useEffect(() => {
    setCustomerOptions(
      customers.customers.map((customer) => ({
        key: customer.id,
        value: customer.email,
        text: customer.name,
      }))
    );
  }, [customers]);

  return (
    <section className={css["create-order"]}>
      <h3>Create invoice</h3>
      <Form className={css.form}>
        <div>
          <div className={css["select-customer-container"]}>
            <label>Customer</label>
            <Form.Select
              placeholder="Select customer..."
              labeled
              options={customerOptions}
              loading={customers.fetching}
              onChange={onCustomerChange}
            />
          </div>
          <div className={css["customer-details"]}>
            {typeof customerDetails === "object" ? (
              <ul>
                {Object.keys(customerDetails)
                  .reverse()
                  .filter((eachKey) => eachKey !== "id")
                  .map((eachKey) => (
                    <>
                      <li>
                        {eachKey !== "image" ? (
                          <>
                            <span>{eachKey}:&nbsp;</span>
                            <span>{(customerDetails as any)[eachKey]}</span>
                          </>
                        ) : (
                          <Image
                            rounded
                            size="tiny"
                            src={customerDetails[eachKey]}
                            alt={customerDetails[eachKey]}
                          />
                        )}
                      </li>
                    </>
                  ))}
              </ul>
            ) : (
              <Message
                header="No customer selected"
                color="yellow"
                content="Please select a customer"
                className={css["message"]}
              />
            )}
          </div>
        </div>
        <div>
          <Input
            type="number"
            name="job_number"
            label="job number"
            icon="fa-solid fa-arrow-down-1-9"
            placeholder="Enter the job's number..."
            value={jobNumber}
            onChange={(e) => onJobNumberChnage(e.target.value)}
            onBlur={onJobNumberBlur as any}
            error={
              jobNumberInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
          <Input
            type="date"
            name="date_received"
            label="date received"
            icon="fa-regular fa-calendar-plus"
            placeholder="Enter date recieved..."
            value={dateReceived}
            onChange={(e) => onDateReceivedChnage(e.target.value)}
            onBlur={onDateReceivedBlur as any}
            error={
              dateReceivedInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
          <Input
            type="date"
            name="date_to_be_completed"
            label="date to be completed"
            icon="fa-regular fa-calendar-minus"
            placeholder="Enter date to be completed..."
            value={dateToBeCompleted}
            onChange={(e) => onDateToBeCompletedChnage(e.target.value)}
            onBlur={onDateToBeCompletedBlur as any}
            error={
              dateToBeCompletedInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
          <Input
            type="text"
            name="instruction_taken_by"
            label="instruction taken by"
            icon="fa-solid fa-chalkboard-user"
            placeholder="Enter who took down the instructions..."
            value={instructionTakenBy}
            onChange={(e) => onInstructionTakenByChnage(e.target.value)}
            onBlur={onInstructionTakenByBlur as any}
            error={
              instructionTakenByInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
          <Input
            type="text"
            name="job_done_by"
            label="job done by"
            icon="fa-solid fa-person-chalkboard"
            placeholder="Enter who performed the job..."
            value={jobDoneBy}
            onChange={(e) => onJobDoneByChnage(e.target.value)}
            onBlur={onJobDoneByBlur as any}
            error={
              jobDoneByInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
          <Input
            type="time"
            name="time_started"
            label="time started"
            icon="fa-regular fa-clock"
            placeholder="Enter the time the job began..."
            value={timeStarted}
            onChange={(e) => onTimeStartedChnage(e.target.value)}
            onBlur={onTimeStartedBlur as any}
            error={
              timeStartedInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
          <Input
            type="time"
            name="time_completed"
            label="time completed"
            icon="fa-regular fa-clock"
            placeholder="Enter the time the job was completed..."
            value={timeCompleted}
            onChange={(e) => onTimeCompletedChnage(e.target.value)}
            onBlur={onTimeCompletedBlur as any}
            error={
              timeCompletedInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
        </div>
      </Form>
    </section>
  );
};

const JobDetailsSection = () => {};

export default CreateOrder;
