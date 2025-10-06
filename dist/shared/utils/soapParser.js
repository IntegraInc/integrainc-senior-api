"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSoapFields = extractSoapFields;
/**
 * Extract specific fields from a parsed SOAP XML response.
 * @param parsedResponse The parsed XML object (from xml2js)
 * @param fields An array of field names to extract (nested fields supported)
 * @returns A simplified object containing only the requested fields
 */
/**
 * Extract specific fields from a parsed SOAP XML response.
 * Detects Senior ERP errors via "erroExecucao" property.
 */
function extractSoapFields(parsedResponse, fields) {
    const result = {};
    function deepFind(obj, key) {
        if (!obj || typeof obj !== "object")
            return undefined;
        if (obj[key] !== undefined)
            return obj[key];
        for (const k of Object.keys(obj)) {
            const found = deepFind(obj[k], key);
            if (found !== undefined)
                return found;
        }
        return undefined;
    }
    // 🧠 Detect SOAP execution error
    const erroExecucao = deepFind(parsedResponse, "erroExecucao");
    // If erroExecucao exists and has no "$", it means Senior returned an actual error
    if (erroExecucao && typeof erroExecucao === "object" && !erroExecucao["$"]) {
        const message = typeof erroExecucao === "string"
            ? erroExecucao
            : JSON.stringify(erroExecucao, null, 2);
        return {
            error: true,
            message: "Senior ERP returned an execution error.",
            details: message,
        };
    }
    // ✅ No error detected → extract requested fields
    for (const field of fields) {
        result[field] = deepFind(parsedResponse, field);
    }
    return {
        error: false,
        data: result,
    };
}
