import { ChangeEvent, FormEvent } from "react";

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
};

export type EachCustomerType = {
  data: CustomerType;
  update: (e: CustomerType) => void;
  deleteItem: (id: string) => void;
  approved: boolean;
  onCheckChange: (customer: CustomerType, checked: boolean) => void;
};

export type ErrorLogsType<T> = {
  date: Date;
  message: string;
  item?: T;
};
