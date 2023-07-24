import { ChangeEvent, FC, HTMLInputTypeAttribute } from "react";
import { DropdownItemProps } from "semantic-ui-react";

export type InputType = {
  className?: string;
  label?: string;
  icon?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | undefined;
  onBlur?: () => void;
  name?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "url"
    | "number"
    | "date"
    | "time"
    | "search"
    | "week"
    | "month"
    | "datetime-local"
    | "tel";
  placeholder?: string;
  id?: string;
  hideLabel?: boolean;
  required?: boolean;
  error?:
    | {
        content: string;
        position?: {
          top?: string | number;
          left?: string | number;
          bottom?: string | number;
          right?: string | number;
        };
      }
    | boolean;
};

export type FileUploadType = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
  onBlur?: () => any;
  value?: File | string;
  label: string;
  className?: string | any;
};

export type ImgUploadType = {
  onChange: (a: any) => any;
  value?: string | any;
  label?: string;
  className?: string | any;
  triggerReset: boolean;
  initialImage?: string | null;
  removeInitialImage?: Function;
};

export type CustomerType = {
  name: string;
  address: string;
  email: string;
  phone: string;
  image?: string;
  id?: string;
};

export type EachRowType<T> = {
  data: T;
  update: (e: T) => void;
  deleteItem: (id: string) => void;
  approved: boolean;
  onCheckChange: (data: T, checked: boolean) => void;
};

export type MaterialType = {
  id: string;
  description: string;
  ["unit price"]: string | number;
};

export type LabourCostType = {
  id: string;
  description: string;
  ["unit price"]: string | number;
};

export type VATType = {
  id: string;
  description: string;
  ["unit price"]: string | number;
};

export type ErrorLogsType<T> = {
  date: Date;
  message: string;
  item?: T;
};

export type SelectorType = {
  modal: ModalType;
  customers: CustomerReducerType;
  materials: MaterialsReducerType;
  vat: VATReducerType;
};

export type ModalType = {
  show: boolean;
  props: {
    component: FC | FC<any> | undefined;
    properties: Record<string, any>;
  };
};

export type CustomerReducerType = {
  customers: CustomerType[];
  fetching: boolean;
  editing: boolean;
  deleting: boolean;
};

export type MaterialsReducerType = {
  materials: MaterialType[];
  fetching: boolean;
  editing: boolean;
  deleting: boolean;
};

export type VATReducerType = {
  vat: VATType[];
  fetching: boolean;
  editing: boolean;
  deleting: boolean;
};

export type ModalPayload<T> = { component: FC<T>; properties: T };
export type JobDetailsType = {
  customerId: string | undefined;
  customerName: string | undefined;
  customerAddress: string | undefined;
  customerPhone: string | undefined;
  customerEmail: string | undefined;
  customerImage?: string;
  jobNumber: string | undefined;
  dateReceived: Date | undefined;
  dateTobeCompleted: Date | undefined;
  instructionTakenBy: string | undefined;
  jobDoneBy: string | undefined;
  timeStarted: string | undefined;
  timeCompleted: string | undefined;
};
export type JobDetailsKeysType =
  | "customerId"
  | "customerName"
  | "customerAddress"
  | "customerPhone"
  | "customerEmail"
  | "jobNumber"
  | "dateReceived"
  | "dateTobeCompleted"
  | "instructionTakenBy"
  | "jobDoneBy"
  | "timeStarted"
  | "timeCompleted";

export type JobDetailsPropsType = {
  customerOptions: DropdownItemProps[];
  customers: CustomerReducerType;
  changeJobDetails: React.Dispatch<React.SetStateAction<JobDetailsType>>;
  jobDetails: JobDetailsType;
  changeSection: React.Dispatch<React.SetStateAction<CreateOrderSectionNames>>;
};

export type MaterialsSectionPropstype = {
  materialOptions: DropdownItemProps[];
  materials: MaterialsReducerType;
  selectedMaterials: MaterialType[];
  changeSelectedMaterials: React.Dispatch<React.SetStateAction<MaterialType[]>>;
  changeSection: React.Dispatch<React.SetStateAction<CreateOrderSectionNames>>;
};

export type LabourCostsSectionPropstype = {
  addedLabourCosts: LabourCostType[];
  changeAddedLabourCosts: React.Dispatch<
    React.SetStateAction<LabourCostType[]>
  >;
  changeSection: React.Dispatch<React.SetStateAction<CreateOrderSectionNames>>;
};

export type CreateOrderSectionNames =
  | "jobDetails"
  | "materials"
  | "labourCosts"
  | "generateInvoice";

export type GenerateInvoiceSectionPropsType = {
  jobDetails: JobDetailsType;
  selectedMaterials: MaterialType[];
  addedLabourCosts: LabourCostType[];
  vatReducer: VATReducerType;
  changeSection: React.Dispatch<React.SetStateAction<CreateOrderSectionNames>>;
};

export type InvoiceDetailsType = JobDetailsType & {
  materials: MaterialType[];
  labourCosts: LabourCostType[];
  vat: number;
};

export type InvoicePropsType = {
  invoiceDetails: InvoiceDetailsType;
};
