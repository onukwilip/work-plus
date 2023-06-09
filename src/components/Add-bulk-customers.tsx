"use client";
import React, { useState, useEffect } from "react";
import css from "@/styles/Add-customer.module.scss";
import Input, { FileUpload, ImgUpload } from "./Input";
import { useForm, useInput } from "use-manage-form";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Icon,
  Message,
  Table,
} from "semantic-ui-react";
import {
  clearSimilarArrayObjects,
  compareTwoArrays,
  convertArrToObj,
  parseUploadedFile,
  validateProperties,
} from "@/utils/utils";
import { CustomerType, EachRowType, ErrorLogsType } from "../../types";
import { ErrorTable } from "@/utils/classes";
import useMessage from "@/hooks/use-message";

const customerProperties = ["name", "address", "phone", "email"];

const EachRow: React.FC<EachRowType<CustomerType>> | (() => null) = ({
  data,
  update,
  deleteItem,
  approved,
  onCheckChange,
}) => {
  // HOOKS
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(false);
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
  const { executeBlurHandlers, reset, formIsValid } = useForm({
    blurHandlers: [onNameBlur, onAddressBlur, onPhoneBlur, onEmailBlur],
    resetHandlers: [resetAddress, resetEmail, resetName, resetPhone],
    validateOptions: () =>
      nameIsValid && emailIsValid && addressIsValid && phoneIsValid,
  });
  //VARIABLES
  const isValidatedStrictly = validateProperties({
    properties: customerProperties,
    object: data,
    strict: true,
  });
  //FUNCTIONS
  const submitHandler = () => {
    if (!formIsValid) return executeBlurHandlers();

    const newCustomer: CustomerType = {
      name: fullname || "",
      address: address || "",
      phone: phone || "",
      email: email || "",
    };
    update(newCustomer);
    reset();
    setEditing(false);
  };
  const checkChangeHandler = (
    e: React.FormEvent<HTMLInputElement>,
    { checked }: CheckboxProps
  ) => {
    setChecked(checked || false);
    onCheckChange(data, checked || false);
  };

  useEffect(() => {
    onNameChange(data.name?.toString());
    onAddressChange(data.address?.toString());
    onEmailChange(data.email?.toString());
    onPhoneChange(data.phone?.toString());
    executeBlurHandlers();
  }, [editing]);
  useEffect(() => {
    if (isValidatedStrictly) {
      setChecked(approved);
    }
  }, [approved]);

  if (editing)
    return (
      <Table.Row
        style={
          !isValidatedStrictly ? { background: "rgba(219,40,40, 0.2)" } : {}
        }
      >
        <Table.Cell collapsing></Table.Cell>
        <Table.Cell>
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
            hideLabel
          />
        </Table.Cell>
        <Table.Cell>
          {" "}
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
            hideLabel
            error={
              emailIsInValid && {
                content: "Input cannot be empty and must be a valid email",
                position: { right: "0" },
              }
            }
          />
        </Table.Cell>
        <Table.Cell>
          {" "}
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
            hideLabel
          />
        </Table.Cell>
        <Table.Cell>
          {" "}
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
            hideLabel
            error={
              phoneIsInValid && {
                content: "Input cannot be empty",
                position: { right: "0" },
              }
            }
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            positive
            icon
            floated="right"
            labelPosition="left"
            onClick={submitHandler}
          >
            <Icon name="arrow up" /> Update
          </Button>
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            negative
            icon
            floated="right"
            labelPosition="left"
            onClick={() => setEditing(false)}
          >
            <Icon name="x" /> Cancel
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  if (
    validateProperties({
      properties: customerProperties,
      object: data,
    })
  )
    return (
      <Table.Row
        style={
          !isValidatedStrictly ? { background: "rgba(219,40,40, 0.2)" } : {}
        }
      >
        <Table.Cell collapsing>
          <Checkbox
            slider
            disabled={!isValidatedStrictly}
            checked={checked}
            onChange={checkChangeHandler}
          />
        </Table.Cell>
        <Table.Cell>{data.name}</Table.Cell>
        <Table.Cell>{data.email}</Table.Cell>
        <Table.Cell>{data.address}</Table.Cell>
        <Table.Cell>{data.phone}</Table.Cell>
        <Table.Cell collapsing>
          <Button
            primary
            icon
            floated="right"
            labelPosition="left"
            onClick={() => setEditing(true)}
          >
            <Icon name="edit" /> Edit
          </Button>
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            negative
            icon
            floated="right"
            labelPosition="left"
            onClick={() => deleteItem(data.email)}
          >
            <Icon name="trash" /> Delete
          </Button>
        </Table.Cell>
      </Table.Row>
    );

  return null;
};

const AddBulkCustomers = () => {
  // VARIABLES
  const validExtensions = ["json", "xlsx"];
  // HOOKS
  const [customers, setCustomers] = useState<CustomerType[] | null>(null);
  const {
    displayMessage: displaySuccess,
    message: successMsg,
    show: showSuccessMsg,
  } = useMessage({
    message: "Customers successfully uploaded",
    timeout: 1000 * 5,
  });
  const [selectedCustomers, setSelectedCustomers] = useState<
    Record<string, CustomerType>
  >({});
  const [errorLogs, setErrorLogs] = useState<ErrorLogsType<CustomerType>[]>([]);
  const [approveAll, setApproveAll] = useState(false);
  const {
    value: uploadedFile,
    inputIsInValid: uploadedFileIsInValid,
    onChange: onFileChange,
    onBlur: onFileBlur,
  } = useInput<File>((value) =>
    validExtensions.includes(value?.name?.split(".")?.pop() || "")
  );
  const [noObjectIsValid, setNoObjectIsValid] = useState(false);

  // FUNCTIONS
  const updateCustomers = async () => {
    const parsedCustomers = await parseUploadedFile<CustomerType[]>(
      uploadedFile
    );

    const processedCustomers =
      parsedCustomers?.filter((customer) =>
        validateProperties({ properties: customerProperties, object: customer })
      ) || [];

    if (processedCustomers?.length < 1) setNoObjectIsValid(true);
    else setNoObjectIsValid(false);

    setCustomers((prevCustomers) =>
      clearSimilarArrayObjects(
        [...(prevCustomers || []), ...(parsedCustomers || [])],
        "email"
      )
    );
  };
  const updateCustomer = (customer: CustomerType) => {
    const index = customers?.findIndex(
      (eachCustomer) => eachCustomer.email === customer.email
    );
    if (index === undefined) return;
    const newCustomers = [...(customers || [])];
    newCustomers[index] = customer;
    setCustomers([...newCustomers]);
  };
  const deleteCustomer = (email: string) => {
    setCustomers((prevCustomers) => [
      ...(prevCustomers?.filter(
        (eachCustomer) => eachCustomer.email !== email
      ) || []),
    ]);
  };
  const onItemCheckChange = (customer: CustomerType, checked: boolean) => {
    if (checked) {
      setSelectedCustomers((prevSelectedCustomers) => ({
        ...prevSelectedCustomers,
        ...{ [customer.email]: customer },
      }));
    } else {
      const oldSelectedCustomers = { ...selectedCustomers };
      delete oldSelectedCustomers[customer.email];
      setSelectedCustomers({ ...oldSelectedCustomers });
    }
  };
  const uploadCustomers = () => {
    const processedCustomers = [];
    // LOOP THROUGH ALL THE SELECTED CUSTOMERS AND VALIDATE EACH OF THEM
    for (const key in selectedCustomers) {
      const isValid = validateProperties({
        properties: customerProperties,
        object: selectedCustomers[key],
        strict: true,
      });
      // IF CUSTOMER IS VALIDATED
      if (isValid) {
        // ADD CUSTOMER TO LIST OF VALIDATED CUSTOMERS
        processedCustomers.push(selectedCustomers[key]);
      }
      // IF CUSTOMER IS NOT VALIDATED
      else {
        // ADD ERROR MESSAGE TO ERROR LIST
        setErrorLogs((prevErrors) => [
          ...prevErrors,
          new ErrorTable<CustomerType>(
            new Date(),
            `User with name: "${selectedCustomers[key].name}" and email: "${selectedCustomers[key].email}" was not uploaded due to incomplete details`
          ),
        ]);
      }
    }
    // REMOVE UPLOADED CUSTOMERS FROM THE LIST OF CUSTOMERS
    const sortedCustomers = compareTwoArrays<CustomerType, CustomerType>(
      customers || [],
      processedCustomers,
      "email"
    );
    // DISSAPROVE ALL UPLOADED CUSTOMERS
    setApproveAll(false);
    // UPDATE THE CUSTOMERS LIST
    setCustomers(sortedCustomers);
    // REMOVE ALL ITEMS FROM THE LIST OF SELECTED CUSTOMERS
    setSelectedCustomers({});
    // DISPLAY SUCCES MESSAGE
    displaySuccess();
  };
  const onApproveAll = () => {
    if (!customers) return;
    setApproveAll(true);
    const approvedCustomers: CustomerType[] = [];
    for (const customer of customers) {
      const isValid = validateProperties({
        properties: customerProperties,
        object: customer,
        strict: true,
      });
      // IF CUSTOMER IS VALIDATED
      if (isValid) {
        // ADD CUSTOMER TO LIST OF VALIDATED CUSTOMERS
        approvedCustomers.push(customer);
      }
      // IF CUSTOMER IS NOT VALIDATED
      else {
        // ADD ERROR MESSAGE TO ERROR LIST
        setErrorLogs((prevErrors) => [
          ...prevErrors,
          new ErrorTable<CustomerType>(
            new Date(),
            `User with name: "${customer.name}" and email: "${customer.email}" could'nt be approved due to incomplete details`
          ),
        ]);
      }
    }
    setSelectedCustomers((prevSelectedCustomers) => ({
      ...prevSelectedCustomers,
      ...convertArrToObj(approvedCustomers, "email"),
    }));
  };
  const onDissaproveAll = () => {
    setApproveAll(false);
    setSelectedCustomers({});
  };
  const clearAllErrorLogs = () => {
    setErrorLogs([]);
  };

  useEffect(() => {
    updateCustomers();
  }, [uploadedFile]);

  return (
    <section className={css["add-bulk-customers"]}>
      <h3>Add Bulk Customers</h3>
      <div className={css.body}>
        <div className={css["file-upload-container"]}>
          <FileUpload
            onChange={(e) => onFileChange(e?.target?.files?.[0])}
            onBlur={() => onFileBlur()}
            label="Upload file"
          />
          {uploadedFile && <code>{uploadedFile.name}</code>}
          {uploadedFileIsInValid && (
            <Message content="File must be a valid JSON or XLSX file" error />
          )}
          {uploadedFile && noObjectIsValid && (
            <Message
              content="Upload a file with atleast one valid customer detail"
              warning
            />
          )}
        </div>
        <div className={css["uploaded-customers-container"]}>
          <Table compact celled definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Phone number</Table.HeaderCell>
                <Table.HeaderCell colspan={2}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {customers?.map((customer) => (
                <EachRow
                  data={customer}
                  key={customer.email}
                  update={updateCustomer}
                  deleteItem={deleteCustomer}
                  approved={approveAll}
                  onCheckChange={onItemCheckChange}
                />
              ))}
            </Table.Body>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan={6}>
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    positive
                    size="small"
                    onClick={uploadCustomers}
                    disabled={Object.keys(selectedCustomers).length < 1}
                  >
                    <Icon name="cloud" /> Upload Customers
                  </Button>
                  <Button size="small" primary onClick={onApproveAll}>
                    Approve all
                  </Button>
                  <Button size="small" negative onClick={onDissaproveAll}>
                    Disapprove all
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
        {showSuccessMsg && <Message success content={successMsg} />}
        <div className={css["error-logs-container"]}>
          <div className={css["error-top"]}>
            <h3>Error logs</h3>
          </div>
          <div className={css["error-logs"]}>
            {errorLogs.map((error) => (
              <p>
                <span>{error.date?.toLocaleTimeString()}</span>
                <span>{error.message}</span>
              </p>
            ))}
          </div>
          <div className={css["error-bottom"]}>
            <Button
              negative
              labelPosition="left"
              floated="right"
              icon
              onClick={clearAllErrorLogs}
            >
              <Icon name="x" />
              Clear logs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddBulkCustomers;
