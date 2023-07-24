"use client";
import React, { FC, useEffect, useState, useMemo, useRef } from "react";
import css from "@/styles/CreateOrder.module.scss";
import {
  Button,
  Checkbox,
  DropdownItemProps,
  DropdownProps,
  Form,
  Icon,
  Image,
  Message,
  Table,
} from "semantic-ui-react";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateOrderSectionNames,
  CustomerReducerType,
  CustomerType,
  GenerateInvoiceSectionPropsType,
  InvoiceDetailsType,
  JobDetailsKeysType,
  JobDetailsPropsType,
  JobDetailsType,
  LabourCostType,
  LabourCostsSectionPropstype,
  MaterialType,
  MaterialsReducerType,
  MaterialsSectionPropstype,
  SelectorType,
  VATReducerType,
} from "../../types";
import { fetchCustomersAction } from "@/store/customersReducer";
import { AnyAction } from "redux";
import { useForm, useInput } from "use-manage-form";
import { CreateOrderSectionsClass } from "@/utils/classes";
import { formatToCurrency, validateObjectValues } from "@/utils/utils";
import { fetchMaterialsAction } from "@/store/materialsReducer";
import { v4 as uuidV4 } from "uuid";
import InvoiceSection from "./InvoiceSection";
import { fetchVATAction } from "@/store/vatReducer";
import ReactToPrint from "react-to-print";

const CreateOrder = () => {
  const customers: CustomerReducerType = useSelector<SelectorType>(
    (state) => state.customers
  ) as CustomerReducerType;
  const [customerOptions, setCustomerOptions] = useState<DropdownItemProps[]>(
    []
  );
  const materials: MaterialsReducerType = useSelector<SelectorType>(
    (state) => state.materials
  ) as MaterialsReducerType;
  const vatReducer: VATReducerType = useSelector<SelectorType>(
    (state) => state.vat
  ) as VATReducerType;
  const [materialOptions, setMaterialOptions] = useState<DropdownItemProps[]>(
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
    customerImage: undefined,
    jobNumber: undefined,
    dateReceived: undefined,
    dateTobeCompleted: undefined,
    instructionTakenBy: undefined,
    jobDoneBy: undefined,
    timeStarted: undefined,
    timeCompleted: undefined,
  });
  const [selectedmaterials, setSelectedMaterials] = useState<MaterialType[]>(
    []
  );
  const [addedLabourCosts, setAddedLabourCosts] = useState<LabourCostType[]>(
    []
  );

  const sections = useMemo<CreateOrderSectionsClass[]>(
    () => [
      new CreateOrderSectionsClass(
        "jobDetails",
        (
          <>
            <JobDetailsSection
              customerOptions={customerOptions}
              jobDetails={jobDetails}
              customers={customers}
              changeJobDetails={setJobDetails}
              changeSection={setCurrentSectionName}
            />
          </>
        )
      ),
      new CreateOrderSectionsClass(
        "materials",
        (
          <>
            <MaterialsSection
              materialOptions={materialOptions}
              changeSection={setCurrentSectionName}
              selectedMaterials={selectedmaterials}
              changeSelectedMaterials={setSelectedMaterials}
              materials={materials}
            />
          </>
        )
      ),
      new CreateOrderSectionsClass(
        "labourCosts",
        (
          <>
            <LabourCostsSection
              addedLabourCosts={addedLabourCosts}
              changeAddedLabourCosts={setAddedLabourCosts}
              changeSection={setCurrentSectionName}
            />
          </>
        )
      ),
      new CreateOrderSectionsClass(
        "generateInvoice",
        (
          <>
            <GenerateInvoice
              jobDetails={jobDetails}
              selectedMaterials={selectedmaterials}
              addedLabourCosts={addedLabourCosts}
              vatReducer={vatReducer}
              changeSection={setCurrentSectionName}
            />
          </>
        )
      ),
    ],
    [
      customerOptions,
      currentSectionName,
      materialOptions,
      selectedmaterials,
      addedLabourCosts,
      vatReducer,
    ]
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
    dispatch(fetchMaterialsAction() as unknown as AnyAction);
    dispatch(fetchVATAction() as unknown as AnyAction);
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
  useEffect(() => {
    setMaterialOptions(
      materials.materials.map((material) => ({
        key: material.id,
        value: material.id,
        text: material.description,
      }))
    );
  }, [materials]);

  return (
    <section className={css["create-order"]}>
      <h3>Create invoice</h3>
      <ul className={css["bread-crumbs"]}>
        {sections.map((section, i) => (
          <>
            <li
              key={i}
              className={
                currentSectionName === section.name ? css["active"] : ""
              }
              // onClick={() => setCurrentSectionName(section.name)}
            >
              <span>{i + 1}</span> {section.name}
            </li>
            {i < sections.length - 1 && <li> &gt; </li>}
          </>
        ))}
      </ul>
      {currentSection.Component}
    </section>
  );
};

const JobDetailsSection: FC<JobDetailsPropsType> = ({
  customerOptions,
  customers,
  changeJobDetails,
  jobDetails,
  changeSection,
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

  const { formIsValid, executeBlurHandlers } = useForm({
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
      timeCompletedIsValid &&
      (customerDetails || false) &&
      validateObjectValues({
        keys: ["id", "name", "address", "email", "phone"],
        object: customerDetails,
        strict: true,
      }),
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
      customerImage: details?.image,
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

  const submitHandler = () => {
    if (!formIsValid) return executeBlurHandlers();

    changeSection("materials");
  };

  // PRESERVE THE DATA OF ALL THE INPUTS
  useEffect(() => {
    setCustomerDetails({
      id: jobDetails.customerId,
      name: jobDetails.customerName || "",
      address: jobDetails.customerAddress || "",
      email: jobDetails.customerEmail || "",
      phone: jobDetails.customerPhone || "",
      image: jobDetails.customerImage,
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
      <Form className={css["job-details-form"]} onSubmit={submitHandler}>
        <div>
          <div className={css["select-customer-container"]}>
            <label>Customer *</label>
            <Form.Select
              placeholder="Select customer..."
              labeled
              options={customerOptions}
              loading={customers.fetching}
              onChange={onCustomerChange}
              defaultValue={customerDetails?.name}
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
                      <li key={eachKey}>
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div>
          <Button animated primary type="submit" disabled={!formIsValid}>
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

const EaahSelectedMaterial: FC<{
  material: MaterialType;
  changeSelectedMaterials: React.Dispatch<React.SetStateAction<MaterialType[]>>;
}> = ({ material, changeSelectedMaterials }) => {
  const removeMaterial = () => {
    changeSelectedMaterials((prevMaterials) =>
      prevMaterials.filter(
        (selectedmaterial) => selectedmaterial.id !== material.id
      )
    );
  };

  return (
    <Table.Row>
      <Table.Cell>{material.description}</Table.Cell>
      <Table.Cell>{formatToCurrency(material["unit price"])}</Table.Cell>
      <Table.Cell collapsing>
        <Button size="small" negative onClick={removeMaterial}>
          Remove
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

const MaterialsSection: FC<MaterialsSectionPropstype> = ({
  materialOptions,
  materials,
  selectedMaterials,
  changeSection,
  changeSelectedMaterials,
}) => {
  const [materialDetails, setMaterialDetails] = useState<
    MaterialType | undefined
  >();

  const onMaterialChange = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    const details = materials.materials.find(
      (material) => material.id === data.value
    );
    setMaterialDetails(details);
  };
  const addMaterial = () => {
    if (materialDetails)
      changeSelectedMaterials((prevMaterials) => [
        ...prevMaterials,
        materialDetails,
      ]);
    setMaterialDetails(undefined);
  };
  const sumTotal = (): string | number => {
    const mappedArr = selectedMaterials.map(
      (material) => material["unit price"]
    );
    if (mappedArr.length > 0)
      return formatToCurrency(
        mappedArr.reduce((prev, curr) => Number(prev) + Number(curr))
      );
    else return formatToCurrency(0);
  };
  const onPreviousClick = () => {
    changeSection("jobDetails");
  };
  const onNextClick = () => {
    changeSection("labourCosts");
  };

  return (
    <>
      <h3>Materials</h3>
      <Form className={css["materials-form"]}>
        <div>
          <div className={css["select-material-container"]}>
            <label>Material</label>
            <Form.Select
              placeholder="Select material..."
              labeled
              options={materialOptions}
              loading={materials.fetching}
              onChange={onMaterialChange}
              defaultValue={materialDetails?.description}
            />
          </div>
          <div className={css["material-details"]}>
            {materialDetails?.description &&
            materialDetails?.id &&
            materialDetails?.["unit price"] ? (
              <ul>
                {Object.keys(materialDetails)
                  .reverse()
                  .filter((eachKey) => eachKey !== "id")
                  .map((eachKey) => (
                    <>
                      <li key={eachKey}>
                        <span>{eachKey}:&nbsp;</span>
                        <span>
                          {eachKey === "unit price"
                            ? formatToCurrency(
                                (materialDetails as any)[eachKey]
                              )
                            : (materialDetails as any)[eachKey]}
                        </span>
                      </li>
                    </>
                  ))}
              </ul>
            ) : (
              <Message
                header="No material selected"
                color="yellow"
                content="Please select a material"
                className={css["message"]}
              />
            )}
          </div>
          <div className={css["actions"]}>
            <Button
              icon
              labelPosition="left"
              primary
              onClick={addMaterial}
              disabled={!materialDetails}
            >
              <Icon name="plus" />
              Add material
            </Button>
          </div>
        </div>
        <div>
          <h4>Selected materials</h4>
          <Table celled selectable={selectedMaterials.length > 0}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Unit price</Table.HeaderCell>
                <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {selectedMaterials.length < 1 ? (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Message content="No materials added" />
                  </Table.Cell>
                </Table.Row>
              ) : (
                selectedMaterials.map((material) => (
                  <EaahSelectedMaterial
                    changeSelectedMaterials={changeSelectedMaterials}
                    material={material}
                    key={material.id}
                  />
                ))
              )}
            </Table.Body>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan="3" textAlign="right">
                  <b>TOTAL: </b>{" "}
                  <span style={{ fontSize: 20 }}>{sumTotal()}</span>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
        <div className={css["actions"]}>
          <Button animated primary type="submit" onClick={onPreviousClick}>
            <Button.Content visible>Previous</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
          <Button animated primary type="submit" onClick={onNextClick}>
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

const EaahSelectedLabourCost: FC<{
  labourCost: LabourCostType;
  changeSelectedLabourCosts: React.Dispatch<
    React.SetStateAction<LabourCostType[]>
  >;
}> = ({ labourCost, changeSelectedLabourCosts }) => {
  const removeLabourCost = () => {
    changeSelectedLabourCosts((prevLabourCosts) =>
      prevLabourCosts.filter(
        (selectedlabourCost) => selectedlabourCost.id !== labourCost.id
      )
    );
  };

  return (
    <Table.Row>
      <Table.Cell>{labourCost.description}</Table.Cell>
      <Table.Cell>{formatToCurrency(labourCost["unit price"])}</Table.Cell>
      <Table.Cell collapsing>
        <Button size="small" negative onClick={removeLabourCost}>
          Remove
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

const LabourCostsSection: FC<LabourCostsSectionPropstype> = ({
  addedLabourCosts,
  changeAddedLabourCosts,
  changeSection,
}) => {
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

  const addLabourCost = () => {
    const labourCostDetails = {
      description: description,
      ["unit price"]: unitPrice || 0,
      id: uuidV4(),
    };
    if (
      validateObjectValues({
        keys: ["description", "unit price", "id"],
        object: labourCostDetails,
        strict: true,
      }) &&
      formIsValid
    ) {
      changeAddedLabourCosts((prevLabourCosts) => [
        ...prevLabourCosts,
        labourCostDetails as MaterialType,
      ]);
      reset();
    } else {
      executeBlurHandlers();
    }
  };
  const sumTotal = (): string | number => {
    const mappedArr = addedLabourCosts.map(
      (labourCost) => labourCost["unit price"]
    );
    if (mappedArr.length > 0)
      return formatToCurrency(
        mappedArr.reduce((prev, curr) => Number(prev) + Number(curr))
      );
    else return formatToCurrency(0);
  };
  const onPreviousClick = () => {
    changeSection("materials");
  };
  const onNextClick = () => {
    changeSection("generateInvoice");
  };

  return (
    <>
      <h3>LabourCosts</h3>
      <Form className={css["labourCosts-form"]}>
        <div className={css["add-labourCost-container"]}>
          <label>Labour cost</label>
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
            <Button
              icon
              labelPosition="left"
              primary
              onClick={addLabourCost}
              disabled={!formIsValid}
            >
              <Icon name="plus" />
              Add labour cost
            </Button>
          </div>
        </div>
        <div>
          <h4>Selected labourCosts</h4>
          <Table celled selectable={addedLabourCosts.length > 0}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Unit price</Table.HeaderCell>
                <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {addedLabourCosts.length < 1 ? (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Message content="No labourCosts added" />
                  </Table.Cell>
                </Table.Row>
              ) : (
                addedLabourCosts.map((labourCost) => (
                  <EaahSelectedLabourCost
                    changeSelectedLabourCosts={changeAddedLabourCosts}
                    labourCost={labourCost}
                    key={labourCost.id}
                  />
                ))
              )}
            </Table.Body>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan="3" textAlign="right">
                  <b>TOTAL: </b>{" "}
                  <span style={{ fontSize: 20 }}>{sumTotal()}</span>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
        <div className={css["actions"]}>
          <Button animated primary type="submit" onClick={onPreviousClick}>
            <Button.Content visible>Previous</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
          <Button animated positive type="submit" onClick={onNextClick}>
            <Button.Content visible>Generate invoice</Button.Content>
            <Button.Content hidden>
              <Icon name="print" />
            </Button.Content>
          </Button>
        </div>
      </Form>
    </>
  );
};

const GenerateInvoice: FC<GenerateInvoiceSectionPropsType> = ({
  jobDetails,
  selectedMaterials,
  addedLabourCosts,
  vatReducer,
  changeSection,
}) => {
  const vat = Number(vatReducer.vat[0]?.["unit price"]);
  let invoiceRef = useRef<HTMLDivElement>();
  const invoiceDetails: InvoiceDetailsType = {
    ...jobDetails,
    materials: selectedMaterials,
    labourCosts: addedLabourCosts,
    vat,
  };
  const onPreviousClick = () => {
    changeSection("labourCosts");
  };

  return (
    <div className={css["generate-invoice"]}>
      <InvoiceSection
        invoiceDetails={invoiceDetails}
        ref={(el) => ((invoiceRef as any) = el)}
      />
      <div className={css.actions}>
        <Button animated primary type="submit" onClick={onPreviousClick}>
          <Button.Content visible>Previous</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow left" />
          </Button.Content>
        </Button>
        <div className={css["sub-actions"]}>
          <ReactToPrint
            trigger={() => (
              <Button icon labelPosition="left" positive>
                <Icon name="print" />
                Print
              </Button>
            )}
            content={() => invoiceRef as any}
          />{" "}
          <Button icon labelPosition="right" primary>
            <Icon name="mail" />
            Send email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
