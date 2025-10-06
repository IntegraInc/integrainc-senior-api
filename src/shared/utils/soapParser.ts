type SoapExtractSuccess<T> = {
 error: false;
 data: T;
};

type SoapExtractError = {
 error: true;
 code: string;
 message: string;
 details?: any;
};

// Generic return type – T is the shape of expected fields
export function extractSoapFields<T = Record<string, any>>(
 parsedResponse: any,
 fields: (keyof T | string)[]
): SoapExtractSuccess<T> | SoapExtractError {
 const result: Record<string, any> = {};

 function deepFind(obj: any, key: string): any {
  if (!obj || typeof obj !== "object") return undefined;
  if (obj[key] !== undefined) return obj[key];

  for (const k of Object.keys(obj)) {
   const found = deepFind(obj[k], key);
   if (found !== undefined) return found;
  }
  return undefined;
 }

 const erroExecucao = deepFind(parsedResponse, "erroExecucao");

 if (erroExecucao && typeof erroExecucao === "object" && !erroExecucao["$"]) {
  const message =
   typeof erroExecucao === "string"
    ? erroExecucao
    : JSON.stringify(erroExecucao, null, 2);

  return {
   error: true,
   code: "SOAP_ERROR",
   message: "Senior ERP returned an execution error.",
   details: message,
  };
 }

 for (const field of fields) {
  result[field as string] = deepFind(parsedResponse, field as string);
 }

 return {
  error: false,
  data: result as T,
 };
}
