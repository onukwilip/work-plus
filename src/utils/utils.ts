import * as XLSX from "xlsx";

export const clearSimilarArrayObjects = <T extends object>(
  arr: T[],
  key: string
) => {
  const currentData: Record<string, T> = {};
  arr.forEach((eachData: Record<any, any>) => {
    currentData[eachData[key]] = eachData;
  });

  const currentDataArray = Object.entries(currentData)?.map(
    ([key, value]) => value
  );

  return currentDataArray;
};

export const parseUploadedFile = async <T>(file: File | undefined) => {
  const onFileReaderLoad = (e: any, resolve: any) => {
    const bufferArray = e.target.result;

    const wb = XLSX.read(bufferArray, { type: "buffer" });

    const wsname = wb.SheetNames[0];

    const ws = wb.Sheets[wsname];

    const data = XLSX.utils.sheet_to_json(ws);

    resolve(data);
  };

  const readExcel = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => onFileReaderLoad(e, resolve);
      fileReader.onerror = (error) => reject(error);
    });

    return promise;
  };

  const readJSON = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        resolve(data);
      };
      fileReader.onerror = (e: any) => reject(e);
    });
    return promise;
  };

  if (!file) return undefined;

  const ext = file.name.split(".")?.pop();

  if (ext === "xlsx") {
    return (await readExcel(file)) as T;
  } else if (ext === "json") {
    return (await readJSON(file)) as T;
  }
};

export const validateProperties = ({
  properties,
  object,
  strict,
}: {
  properties: string[];
  object: Record<any, any>;
  strict?: boolean;
}) => {
  let propertyNotExist = 0;
  for (const property of properties) {
    if (!Object.hasOwn(object, property)) {
      propertyNotExist++;
      if (strict) return false;
    }
  }

  if (propertyNotExist === properties?.length) return false;
  return true;
};

export const validateObjectValues = ({
  keys,
  object,
  strict,
}: {
  keys: string[];
  object: Record<any, any>;
  strict?: boolean;
}) => {
  let valueIsUndefined = 0;
  for (const key of keys) {
    if (!object[key]) {
      valueIsUndefined++;
      if (strict) return false;
    }
  }

  if (valueIsUndefined === keys?.length) return false;
  return true;
};

export const compareTwoArrays = <arr1T, arr2T>(
  arr1: (arr1T | any)[],
  arr2: (arr2T | any)[],
  key: string | number
) => {
  const result: arr1T[] = [];
  for (const value of arr1) {
    const arr2HasValue =
      arr2.findIndex(
        (value2) =>
          typeof value2 === "object" &&
          typeof value === "object" &&
          value2?.[key] === value?.[key]
      ) !== -1;
    if (arr2HasValue) continue;
    result.push(value);
  }

  return result;
};

export const convertArrToObj = <T extends Record<any, any>>(
  arr: T[],
  key: string | number
) => {
  const result: Record<string | number, T> = {};
  for (const item of arr) {
    if (!Array.isArray(item) && typeof item === "object") {
      result[item[key]] = item;
    }
  }

  return result;
};
