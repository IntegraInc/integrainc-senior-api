import { deepNormalizeSoap } from "./soapParser";

type SoapOk<T> = { ok: true; value: T };
type SoapFail = { ok: false; code: string; message: string; details?: any };
type SoapOut<T> = SoapOk<T> | SoapFail;

function safeStringify(v: any) {
 try {
  return JSON.stringify(v, null, 2);
 } catch {
  return String(v);
 }
}

function looksLikeJson(s: string) {
 const t = s.trim();
 return t.startsWith("{") || t.startsWith("[");
}

function maybeBase64ToUtf8(s: string): string {
 const t = s.trim();
 if (looksLikeJson(t)) return t;

 try {
  const decoded = Buffer.from(t, "base64").toString("utf8").trim();
  if (looksLikeJson(decoded)) return decoded;
 } catch {}

 return t;
}

export class SoapResult {
 private normalized: any;

 private constructor(normalized: any) {
  this.normalized = normalized;
 }

 static from(parsedXml2js: any) {
  return new SoapResult(deepNormalizeSoap(parsedXml2js));
 }

 private deepFind(obj: any, key: string): any {
  if (!obj || typeof obj !== "object") return undefined;
  if (obj[key] !== undefined) return obj[key];
  for (const k of Object.keys(obj)) {
   const found = this.deepFind(obj[k], key);
   if (found !== undefined) return found;
  }
  return undefined;
 }

 errorIfAny(): SoapFail | null {
  const erroExecucao = this.deepFind(this.normalized, "erroExecucao");
  if (typeof erroExecucao === "string" && erroExecucao.trim()) {
   return {
    ok: false,
    code: "SOAP_ERROR",
    message: "Senior ERP returned an execution error.",
    details: erroExecucao.trim(),
   };
  }
  return null;
 }

 /** Retorna o campo já normalizado, seja string/objeto/array */
 value<T = any>(field: string): SoapOut<T> {
  const err = this.errorIfAny();
  if (err) return err;

  const v = this.deepFind(this.normalized, field);

  if (v === undefined || v === null || v === "") {
   return {
    ok: false,
    code: "MISSING_FIELD",
    message: `Campo '${field}' não encontrado ou vazio.`,
   };
  }

  return { ok: true, value: v as T };
 }

 /**
  * Retorna JSON parseado:
  * - se vier objeto/array → retorna direto
  * - se vier string JSON → JSON.parse
  * - se vier base64 → decode + JSON.parse (fallback)
  */
 json<T = any>(field: string): SoapOut<T> {
  const got = this.value<any>(field);
  if (!got.ok) return got;

  const v = got.value;

  // ✅ já é objeto/array
  if (typeof v === "object") return { ok: true, value: v as T };

  // ✅ string → tenta JSON direto / base64
  if (typeof v === "string") {
   const txt = maybeBase64ToUtf8(v);
   try {
    return { ok: true, value: JSON.parse(txt) as T };
   } catch (e: any) {
    return {
     ok: false,
     code: "INVALID_JSON",
     message: `Campo '${field}' não é JSON válido.`,
     details: e.message,
    };
   }
  }

  return {
   ok: false,
   code: "INVALID_TYPE",
   message: `Campo '${field}' tem tipo inválido para JSON.`,
   details: { typeof: typeof v, value: v },
  };
 }

 /** Helper: garante array (quando xml2js devolve 1 item como objeto) */
 array<T = any>(field: string): SoapOut<T[]> {
  const got = this.value<any>(field);
  if (!got.ok) return got as any;

  const v = got.value;

  if (Array.isArray(v)) return { ok: true, value: v as T[] };
  return { ok: true, value: [v] as T[] }; // ✅ se veio único objeto
 }
}
