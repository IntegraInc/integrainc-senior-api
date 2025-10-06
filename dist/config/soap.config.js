"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soapConfig = void 0;
require("dotenv/config");
exports.soapConfig = {
    seniorUrl: process.env.SENIOR_SOAP_URL || "",
    timeout: 30000,
};
