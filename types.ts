import { ChangeEvent, FC } from "react";

export type InputType = {
  className?: string;
  label?: string;
  icon: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string | undefined;
  onBlur: () => void;
  name: string;
  type: string;
  placeholder: string;
  id: string;
  hideLabel?: boolean;
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

export type ErrorLogsType<T> = {
  date: Date;
  message: string;
  item?: T;
};

export type SelectorType = {
  modal: ModalType;
  customers: CustomerReducerType;
  materials: MaterialsReducerType;
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

export type ModalPayload<T> = { component: FC<T>; properties: T };
