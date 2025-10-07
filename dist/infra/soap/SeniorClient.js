"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeniorClient = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const soap_config_1 = require("../../config/soap.config");
require("dotenv/config");
class SeniorClient {
    constructor() {
        this.url = soap_config_1.soapConfig.seniorUrl;
    }
    async authenticate(user, password, encryption) {
        const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
        <soapenv:Body>
          <ser:AuthenticateJAAS>
            <user>${user}</user>
            <password>${password}</password>
            <encryption>${encryption}</encryption>
            <parameters>
              <pmUserName>${user}</pmUserName>
              <pmUserPassword>${password}</pmUserPassword>
              <pmEncrypted>${encryption}</pmEncrypted>
            </parameters>
          </ser:AuthenticateJAAS>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
        try {
            const { data } = await axios_1.default.post(this.url, xmlBody, {
                headers: {
                    "Content-Type": "text/xml;charset=UTF-8",
                    SOAPAction: this.url,
                },
                timeout: soap_config_1.soapConfig.timeout,
            });
            console.log(this.url);
            const parsed = await (0, xml2js_1.parseStringPromise)(data, { explicitArray: false });
            return parsed;
        }
        catch (error) {
            console.error("❌ Senior SOAP authentication error:", error.message);
            throw new Error("Failed to authenticate with Senior SOAP service.");
        }
    }
}
exports.SeniorClient = SeniorClient;
