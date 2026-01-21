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
export function isSoapNil(v: any) {
 return (
  v &&
  typeof v === "object" &&
  v.$ &&
  (v.$["xsi:nil"] === "true" ||
   v.$["xsi:nil"] === true ||
   v.$["nil"] === "true" ||
   v.$["nil"] === true)
 );
}

export function deepNormalizeSoap(obj: any): any {
 if (obj === null || obj === undefined) return "";

 if (isSoapNil(obj)) return "";

 if (Array.isArray(obj)) {
  if (obj.length === 0) return "";
  return deepNormalizeSoap(obj[0]);
 }

 if (typeof obj === "object") {
  // caso clássico do xml2js: { _: "valor", $: {...} }
  if ("_" in obj && Object.keys(obj).every((k) => k === "_" || k === "$")) {
   return deepNormalizeSoap((obj as any)._);
  }

  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
   out[k] = deepNormalizeSoap(v);
  }
  return out;
 }

 return obj;
}
