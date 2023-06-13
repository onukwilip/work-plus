"use client";
import React, { useState, useEffect } from "react";
import css from "@/styles/Add-material.module.scss";
import Input, { FileUpload } from "./Input";
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
import { MaterialType, EachRowType, ErrorLogsType } from "../../types";
import { ErrorTable } from "@/utils/classes";
import useMessage from "@/hooks/use-message";
import { v4 as uuidV4 } from "uuid";

const materialProperties = ["id", "description", "unit price"];

const EachRow: React.FC<EachRowType<MaterialType>> | (() => null) = ({
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
  //VARIABLES
  const isValidatedStrictly = validateProperties({
    properties: materialProperties,
    object: data,
    strict: true,
  });
  //FUNCTIONS
  const submitHandler = () => {
    if (!formIsValid) return executeBlurHandlers();

    const newMaterial: MaterialType = {
      id: data.id,
      description: description as string,
      ["unit price"]: unitPrice as string,
    };
    update(newMaterial);
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
    onDescriptionChange(data.description?.toString());
    onUnitPriceChange(data["unit price"]?.toString());
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
            icon="fas fa-circle-info"
            onChange={(e) => onDescriptionChange(e?.target?.value)}
            onBlur={onDescriptionBlur as any}
            value={description}
            name="description"
            type="text"
            placeholder="Enter description"
            id="description"
            error={descriptionIsInValid && { content: "Input cannot be empty" }}
          />
        </Table.Cell>
        <Table.Cell>
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
      properties: materialProperties,
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
        <Table.Cell>{data.description}</Table.Cell>
        <Table.Cell>
          {data["unit price"] &&
            Number(data["unit price"])?.toLocaleString("en-Us", {
              style: "currency",
              currency: "NGN",
            })}
        </Table.Cell>
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
            onClick={() => deleteItem(data.id)}
          >
            <Icon name="trash" /> Delete
          </Button>
        </Table.Cell>
      </Table.Row>
    );

  return null;
};

const AddBulkMaterials = () => {
  // VARIABLES
  const validExtensions = ["json", "xlsx"];
  // HOOKS
  const [materials, setMaterials] = useState<MaterialType[] | null>(null);
  const {
    displayMessage: displaySuccess,
    message: successMsg,
    show: showSuccessMsg,
  } = useMessage({
    message: "Materials successfully uploaded",
    timeout: 1000 * 5,
  });
  const [selectedMaterials, setSelectedMaterials] = useState<
    Record<string, MaterialType>
  >({});
  const [errorLogs, setErrorLogs] = useState<ErrorLogsType<MaterialType>[]>([]);
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
  const updateMaterials = async () => {
    const parsedMaterials = await parseUploadedFile<MaterialType[]>(
      uploadedFile
    );

    const processedMaterials =
      parsedMaterials?.filter((material) =>
        validateProperties({ properties: materialProperties, object: material })
      ) || [];

    if (processedMaterials?.length < 1) setNoObjectIsValid(true);
    else setNoObjectIsValid(false);

    setMaterials((prevMaterials) =>
      clearSimilarArrayObjects(
        [...(prevMaterials || []), ...(parsedMaterials || [])],
        "id"
      )
    );
  };
  const updateMaterial = (material: MaterialType) => {
    const index = materials?.findIndex(
      (eachMaterial) => eachMaterial.id === material.id
    );
    if (index === undefined) return;
    const newMaterials = [...(materials || [])];
    newMaterials[index] = material;
    setMaterials([...newMaterials]);
  };
  const deleteMaterial = (id: string) => {
    setMaterials((prevMaterials) => [
      ...(prevMaterials?.filter((eachMaterial) => eachMaterial.id !== id) ||
        []),
    ]);
  };
  const onItemCheckChange = (material: MaterialType, checked: boolean) => {
    if (checked) {
      setSelectedMaterials((prevSelectedMaterials) => ({
        ...prevSelectedMaterials,
        ...{ [material.id]: material },
      }));
    } else {
      const oldSelectedMaterials = { ...selectedMaterials };
      delete oldSelectedMaterials[material.id];
      setSelectedMaterials({ ...oldSelectedMaterials });
    }
  };
  const uploadMaterials = () => {
    const processedMaterials = [];
    // LOOP THROUGH ALL THE SELECTED MATERIALS AND VALIDATE EACH OF THEM
    for (const key in selectedMaterials) {
      const isValid = validateProperties({
        properties: materialProperties,
        object: selectedMaterials[key],
        strict: true,
      });
      // IF MATERIAL IS VALIDATED
      if (isValid) {
        // ADD MATERIAL TO LIST OF VALIDATED MATERIALS
        processedMaterials.push(selectedMaterials[key]);
      }
      // IF MATERIAL IS NOT VALIDATED
      else {
        // ADD ERROR MESSAGE TO ERROR LIST
        setErrorLogs((prevErrors) => [
          ...prevErrors,
          new ErrorTable<MaterialType>(
            new Date(),
            `Material with description: "${selectedMaterials[key].description}" and id: "${selectedMaterials[key].id}" was not uploaded due to incomplete details`
          ),
        ]);
      }
    }
    // REMOVE UPLOADED MATERIALS FROM THE LIST OF MATERIALS
    const sortedMaterials = compareTwoArrays<MaterialType, MaterialType>(
      materials || [],
      processedMaterials,
      "id"
    );
    // DISSAPROVE ALL UPLOADED MATERIALS
    setApproveAll(false);
    // UPDATE THE MATERIALS LIST
    setMaterials(sortedMaterials);
    // REMOVE ALL ITEMS FROM THE LIST OF SELECTED MATERIALS
    setSelectedMaterials({});
    // DISPLAY SUCCES MESSAGE
    displaySuccess();
  };
  const onApproveAll = () => {
    if (!materials) return;
    setApproveAll(true);
    const approvedMaterials: MaterialType[] = [];
    for (const material of materials) {
      const isValid = validateProperties({
        properties: materialProperties,
        object: material,
        strict: true,
      });
      // IF MATERIAL IS VALIDATED
      if (isValid) {
        // ADD MATERIAL TO LIST OF VALIDATED MATERIALS
        approvedMaterials.push(material);
      }
      // IF MATERIAL IS NOT VALIDATED
      else {
        // ADD ERROR MESSAGE TO ERROR LIST
        setErrorLogs((prevErrors) => [
          ...prevErrors,
          new ErrorTable<MaterialType>(
            new Date(),
            `Material with description: "${material.description}" and id: "${material.id}" could'nt be approved due to incomplete details`
          ),
        ]);
      }
    }
    setSelectedMaterials((prevSelectedMaterials) => ({
      ...prevSelectedMaterials,
      ...convertArrToObj(approvedMaterials, "id"),
    }));
  };
  const onDissaproveAll = () => {
    setApproveAll(false);
    setSelectedMaterials({});
  };
  const clearAllErrorLogs = () => {
    setErrorLogs([]);
  };

  useEffect(() => {
    updateMaterials();
  }, [uploadedFile]);

  return (
    <section className={css["add-bulk-materials"]}>
      <h3>Add Bulk Materials</h3>
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
              content="Upload a file with atleast one valid material detail"
              warning
            />
          )}
        </div>
        <div className={css["uploaded-materials-container"]}>
          <Table compact celled definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Unit price</Table.HeaderCell>
                <Table.HeaderCell colspan={2}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {materials?.map((material) => (
                <EachRow
                  data={material}
                  key={material.id}
                  update={updateMaterial}
                  deleteItem={deleteMaterial}
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
                    onClick={uploadMaterials}
                    disabled={Object.keys(selectedMaterials).length < 1}
                  >
                    <Icon name="cloud" /> Upload Materials
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

export default AddBulkMaterials;
