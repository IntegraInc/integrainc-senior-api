"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSoapFields = extractSoapFields;
// Generic return type – T is the shape of expected fields
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
    const erroExecucao = deepFind(parsedResponse, "erroExecucao");
    if (erroExecucao && typeof erroExecucao === "object" && !erroExecucao["$"]) {
        const message = typeof erroExecucao === "string"
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
        result[field] = deepFind(parsedResponse, field);
    }
    return {
        error: false,
        data: result,
    };
}
