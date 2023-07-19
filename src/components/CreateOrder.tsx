"use client";
import React, { FC, useEffect, useState, useMemo } from "react";
import css from "@/styles/CreateOrder.module.scss";
import {
  Button,
  DropdownItemProps,
  DropdownProps,
  Form,
  Icon,
  Image,
  Message,
} from "semantic-ui-react";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateOrderSectionNames,
  CustomerReducerType,
  CustomerType,
  JobDetailsKeysType,
  JobDetailsPropsType,
  JobDetailsType,
  SelectorType,
} from "../../types";
import { fetchCustomersAction } from "@/store/customersReducer";
import { AnyAction } from "redux";
import { useForm, useInput } from "use-manage-form";
import { CreateOrderSectionsClass } from "@/utils/classes";

const CreateOrder = () => {
  const customers: CustomerReducerType = useSelector<SelectorType>(
    (state) => state.customers
  ) as CustomerReducerType;
  const [customerOptions, setCustomerOptions] = useState<DropdownItemProps[]>(
    []
  );
  const [currentSectionName, setCurrentSectionName] =
    useState<CreateOrderSectionNames>("jobDetails");
  const dispatch = useDispatch();
  const [jobDetails, setJobDetails] = useState<JobDetailsType>({
    customerId: undefined,
    customerName: undefined,
    customerAddress: undefined,
    customerPhone: undefined,
    customerEmail: undefined,
    jobNumber: undefined,
    dateReceived: undefined,
    dateTobeCompleted: undefined,
    instructionTakenBy: undefined,
    jobDoneBy: undefined,
    timeStarted: undefined,
    timeCompleted: undefined,
  });
  const sections = useMemo<CreateOrderSectionsClass<any>[]>(
    () => [
      new CreateOrderSectionsClass<JobDetailsPropsType>(
        "jobDetails",
        JobDetailsSection,
        {
          customerOptions: customerOptions,
          customers: customers,
          jobDetails: jobDetails,
          changeJobDetails: setJobDetails,
          changeSection: setCurrentSectionName,
        }
      ),
    ],
    []
  );
  const getCurrentSection = () => {
    const section = sections.find(
      (section) => section.name === currentSectionName
    );

    if (!section) return sections[0];

    return section;
  };
  const currentSection = getCurrentSection();

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
  //   useEffect(() => {
  //     console.log("DETAILS", jobDetails);
  //   }, [jobDetails]);

  return (
    <section className={css["create-order"]}>
      <h3>Create invoice</h3>
      <ul className={css["bread-crumbs"]}>
        {sections.map((section, i) => (
          <li
            key={i}
            className={currentSectionName === section.name ? css["active"] : ""}
          >
            {section.name} {i < sections.length - 1 && ">"}
          </li>
        ))}
      </ul>
      <currentSection.Component {...currentSection.props} />
    </section>
  );
};

const JobDetailsSection: FC<JobDetailsPropsType> = ({
  customerOptions,
  customers,
  changeJobDetails,
  jobDetails,
}) => {
  const [customerDetails, setCustomerDetails] = useState<
    CustomerType | undefined
  >();
  // INPUTS
  const {
    value: jobNumber,
    isValid: jobNumberIsValid,
    inputIsInValid: jobNumberInputIsInvalid,
    onChange: onJobNumberChange,
    onBlur: onJobNumberBlur,
    reset: resetJobNumber,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: dateReceived,
    isValid: dateReceivedIsValid,
    inputIsInValid: dateReceivedInputIsInvalid,
    onChange: onDateReceivedChange,
    onBlur: onDateReceivedBlur,
    reset: resetDateReceived,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: dateToBeCompleted,
    isValid: dateToBeCompletedIsValid,
    inputIsInValid: dateToBeCompletedInputIsInvalid,
    onChange: onDateToBeCompletedChange,
    onBlur: onDateToBeCompletedBlur,
    reset: resetDateToBeCompleted,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: instructionTakenBy,
    isValid: instructionTakenByIsValid,
    inputIsInValid: instructionTakenByInputIsInvalid,
    onChange: onInstructionTakenByChange,
    onBlur: onInstructionTakenByBlur,
    reset: resetInstructionTakenBy,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: jobDoneBy,
    isValid: jobDoneByIsValid,
    inputIsInValid: jobDoneByInputIsInvalid,
    onChange: onJobDoneByChange,
    onBlur: onJobDoneByBlur,
    reset: resetJobDoneBy,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: timeStarted,
    isValid: timeStartedIsValid,
    inputIsInValid: timeStartedInputIsInvalid,
    onChange: onTimeStartedChange,
    onBlur: onTimeStartedBlur,
    reset: resetTimeStarted,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );
  const {
    value: timeCompleted,
    isValid: timeCompletedIsValid,
    inputIsInValid: timeCompletedInputIsInvalid,
    onChange: onTimeCompletedChange,
    onBlur: onTimeCompletedBlur,
    reset: resetTimeCompleted,
  } = useInput<string>(
    (value) => value?.trim() !== "" && (value ? true : false)
  );

  const {} = useForm({
    blurHandlers: [
      onJobNumberBlur,
      onDateReceivedBlur,
      onDateToBeCompletedBlur,
      onInstructionTakenByBlur,
      onJobDoneByBlur,
      onTimeStartedBlur,
      onTimeCompletedBlur,
    ],
    resetHandlers: [
      resetJobNumber,
      resetDateReceived,
      resetDateToBeCompleted,
      resetInstructionTakenBy,
      resetJobDoneBy,
      resetTimeStarted,
      resetTimeCompleted,
    ],
    validateOptions: () =>
      jobNumberIsValid &&
      dateReceivedIsValid &&
      dateToBeCompletedIsValid &&
      instructionTakenByIsValid &&
      jobDoneByIsValid &&
      timeStartedIsValid &&
      timeCompletedIsValid,
  });

  const onCustomerChange = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    const details = customers.customers.find(
      (customer) => customer.email === data.value
    );
    setCustomerDetails(details);
    changeJobDetails((prevDetails) => ({
      ...prevDetails,
      customerId: details?.id,
      customerAddress: details?.address,
      customerEmail: details?.email,
      customerName: details?.name,
      customerPhone: details?.phone,
    }));
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: JobDetailsKeysType,
    changeHandler: Function
  ) => {
    changeHandler(e.target.value);
    changeJobDetails((prevDetails) => ({
      ...prevDetails,
      [key]: e.target.value,
    }));
  };

  // PRESERVE THE DATA OF ALL THE INPUTS
  useEffect(() => {
    setCustomerDetails({
      id: jobDetails.customerId,
      name: jobDetails.customerName || "",
      address: jobDetails.customerAddress || "",
      email: jobDetails.customerEmail || "",
      phone: jobDetails.customerPhone || "",
    });
    onJobNumberChange(jobDetails.jobNumber);
    onDateReceivedChange(jobDetails.dateReceived);
    onDateToBeCompletedChange(jobDetails.dateTobeCompleted);
    onInstructionTakenByChange(jobDetails.instructionTakenBy);
    onJobDoneByChange(jobDetails.jobDoneBy);
    onTimeStartedChange(jobDetails.timeStarted);
    onTimeCompletedChange(jobDetails.timeCompleted);
  }, []);

  return (
    <>
      <h3>Job details</h3>
      <Form className={css["job-details-form"]}>
        <div>
          <div className={css["select-customer-container"]}>
            <label>Customer</label>
            <Form.Select
              placeholder="Select customer..."
              labeled
              options={customerOptions}
              loading={customers.fetching}
              onChange={onCustomerChange}
              defaultValue={jobDetails.customerName}
            />
          </div>
          <div className={css["customer-details"]}>
            {customerDetails?.name &&
            customerDetails?.email &&
            customerDetails?.address &&
            customerDetails?.phone &&
            customerDetails?.id ? (
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
            onChange={(e) =>
              handleDetailsChange(e, "jobNumber", onJobNumberChange)
            }
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
            onChange={(e) =>
              handleDetailsChange(e, "dateReceived", onDateReceivedChange)
            }
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
            onChange={(e) =>
              handleDetailsChange(
                e,
                "dateTobeCompleted",
                onDateToBeCompletedChange
              )
            }
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
            onChange={(e) =>
              handleDetailsChange(
                e,
                "instructionTakenBy",
                onInstructionTakenByChange
              )
            }
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
            onChange={(e) =>
              handleDetailsChange(e, "jobDoneBy", onJobDoneByChange)
            }
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
            onChange={(e) =>
              handleDetailsChange(e, "timeStarted", onTimeStartedChange)
            }
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
            onChange={(e) =>
              handleDetailsChange(e, "timeCompleted", onTimeCompletedChange)
            }
            onBlur={onTimeCompletedBlur as any}
            error={
              timeCompletedInputIsInvalid && {
                content: "Input must not be empty",
              }
            }
          />
        </div>
        <div>
          <Button animated primary>
            <Button.Content visible>Next</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateOrder;
