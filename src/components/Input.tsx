import { ChangeEvent, LegacyRef, useEffect, useRef, useState } from "react";
import { FileUploadType, ImgUploadType, InputType } from "../../types";
import css from "@/styles/Input.module.scss";
import { Icon } from "semantic-ui-react";

const Input: React.FC<InputType> = ({
  className,
  icon,
  onChange,
  value,
  onBlur,
  name,
  type,
  placeholder,
  id,
  label,
  error,
  hideLabel,
  required,
  ...props
}) => {
  const inputHolder = useRef<HTMLDivElement>(null);
  const inputElem = useRef<HTMLInputElement>(null);
  const errorElem = useRef<HTMLElement>(null);
  const [passwordTypeState, setPasswordTypeState] = useState("password");

  const toogleHide = () => {
    if (inputElem.current?.type === "password") {
      inputElem.current.type = "text";
      setPasswordTypeState("text");
    } else if (inputElem.current?.type === "text") {
      inputElem.current.type = "password";
      setPasswordTypeState("password");
    }
  };

  const onInputClick = () => {
    inputHolder.current?.classList.add(css.active);
    errorElem.current?.classList.remove("fa-beat");
  };

  const onInputElementChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputClick();
    typeof onChange === "function" && onChange(e);
  };

  const onDocumentClick = (e: Event) => {
    const clickedElem = e.target;

    if (
      inputElem.current?.value?.trim() === "" &&
      !inputHolder.current?.contains(clickedElem as any)
    ) {
      inputHolder.current?.classList.remove(css.active);
      errorElem.current?.classList.add("fa-beat");
    }
  };

  useEffect(() => {
    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  return (
    <div className={css.input}>
      {!hideLabel && (
        <label htmlFor={id}>
          {label || name} {required && "*"}
        </label>
      )}
      <div
        className={`${css["input-holder"]} ${error ? css.error : ""} ${
          className || ""
        }`}
        ref={inputHolder}
        onClick={onInputClick}
      >
        <i className={icon}></i>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onInputElementChange}
          onBlur={onBlur}
          ref={inputElem}
          id={id}
          value={value}
          {...props}
        />
        {type === "password" ? (
          <i
            className={`${css.toogle} ${
              passwordTypeState === "password" ? "icon eye" : "icon eye slash"
            }`}
            onClick={toogleHide}
          ></i>
        ) : null}
        {error && (
          <span className={css.error}>
            <i
              className={`${css.error} fa-solid fa-triangle-exclamation fa-beat`}
              ref={errorElem}
            ></i>
            {typeof error === "object" && (
              <span style={{ ...(error.position || { right: 0 }) }}>
                {error?.content}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export const FileUpload: React.FC<FileUploadType> = ({
  onChange,
  onBlur,
  value,
  label,
  className,
}) => {
  return (
    <div className={`${css["file-upload"]} ${className}`}>
      <label>
        <input
          type="file"
          hidden
          value={value as string}
          onChange={(e) => {
            onChange(e);
            onBlur && onBlur();
          }}
        />
        <Icon name="cloud upload" />
        <em style={{ textAlign: "center" }}>{label ? label : "Upload file"}</em>
      </label>
    </div>
  );
};

export const ImgUpload: React.FC<ImgUploadType> = ({
  onChange,
  value,
  label,
  className,
  triggerReset,
  initialImage,
  removeInitialImage,
}) => {
  const fileRef = useRef<HTMLInputElement>()!;
  const [uploaded, setUploaded] = useState<string | null>("");

  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    setUploaded(URL.createObjectURL(file));
    onChange(e);
  };

  useEffect(() => {
    setUploaded(null);
  }, [triggerReset]);

  return (
    <div className={`${css["file-upload"]} ${className}`}>
      {uploaded || initialImage ? (
        <div className={css["img-container"]}>
          <img
            src={uploaded || (initialImage as string)}
            alt={fileRef?.current?.files?.[0]?.name}
          />
          <Icon
            className={css.edit}
            name="cancel"
            onClick={() => {
              onChange(null);
              setUploaded(null);
              removeInitialImage && removeInitialImage(null);
              onChange(null);
            }}
          />
        </div>
      ) : (
        <label>
          <input
            type="file"
            hidden
            ref={fileRef as LegacyRef<HTMLInputElement>}
            value={value?.filename}
            onChange={onFileChange}
          />
          <Icon name="cloud upload" />
          <em>{label ? label : "Upload image"}</em>
        </label>
      )}
    </div>
  );
};
export default Input;
