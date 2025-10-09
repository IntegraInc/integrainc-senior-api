import axios from "axios";
import { parseStringPromise } from "xml2js";
import { soapConfig } from "../../config/soap.config";
import "dotenv/config";

export class SeniorClient {
 private readonly url: string;
 private readonly userModule: string;
 private readonly productModule: string;

 constructor() {
  this.url = soapConfig.seniorUrl;
  this.userModule = soapConfig.userModule;
  this.productModule = soapConfig.productModule;
 }

 async authenticate(user: string, password: string, encryption: number) {
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
   const { data } = await axios.post(this.url, xmlBody, {
    headers: {
     "Content-Type": "text/xml;charset=UTF-8",
     SOAPAction: this.url + this.userModule,
    },
    timeout: soapConfig.timeout,
   });

   const parsed = await parseStringPromise(data, { explicitArray: false });
   return parsed;
  } catch (error: any) {
   console.error("❌ Senior SOAP authentication error:", error.message);
   throw new Error("Failed to authenticate with Senior SOAP service.");
  }
 }

 async exportTablePrice(limit: number, page: number) {
  const user = "portal";
  const password = "Senior@2025";
  const encryption = 0;
  const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:exportaTabelaPrecos>
         <user>${user}</user>
         <password>${password}</password>
         <encryption>${encryption}</encryption>
         <parameters>
            <limit>${limit}</limit>
            <page>${page}</page>
         </parameters>
      </ser:exportaTabelaPrecos>
   </soapenv:Body>
</soapenv:Envelope>
    `;

  try {
   const { data } = await axios.post(
    `${this.url + this.productModule}`,
    xmlBody,
    {
     headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: this.url + this.productModule,
     },
     timeout: soapConfig.timeout,
    }
   );

   const parsed = await parseStringPromise(data, { explicitArray: false });
   return parsed;
  } catch (error: any) {
   console.error("❌ Senior SOAP authentication error:", error.message);
   throw new Error("Failed to authenticate with Senior SOAP service.");
  }
 }
}
