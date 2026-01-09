import axios from "axios";
import { parseStringPromise } from "xml2js";
import { soapConfig } from "../../config/soap.config";
import iconv from "iconv-lite";
import "dotenv/config";

export class SeniorClient {
 private readonly url: string;
 private readonly userModule: string;
 private readonly productModule: string;
 private readonly buyingOrderModule: string;

 constructor() {
  this.url = soapConfig.seniorUrl;
  this.userModule = soapConfig.userModule;
  this.productModule = soapConfig.productModule;
  this.buyingOrderModule = soapConfig.buyingOrderModule;
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
   const { data } = await axios.post(this.url + this.userModule, xmlBody, {
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
 async exportTablePrice(
  user: string,
  password: string,
  limit: number,
  page: number,
  tablePrice: string,
  markup: number,
  margin: number,
  family: string
 ) {
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
            <limit>${limit || 9999}</limit>
            <page>${page || 1} </page>
            <codtpr>${tablePrice}</codtpr>
            <codfam>${family}</codfam>
            <permargem>${margin}</permargem>
            <permarkup>${markup}</permarkup>
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
 async exportAnalisys(
  user: string,
  password: string,
  encryption: number,
  limit: number,
  page: number,
  family?: string
 ) {
  const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:exportaAnaliseReposicao>
         <user>${user}</user>
         <password>${password}</password>
         <encryption>${encryption}</encryption>
         <parameters>
            <limit>${limit || 9999}</limit>
            <page>${page || 1}</page>
            <family>${family}</family>
         </parameters>
      </ser:exportaAnaliseReposicao>
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
 async getFilters(user: string, password: string, encryption: number) {
  const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:buscaFiltros>
         <user>${user}</user>
         <password>${password}</password>
         <encryption>${encryption}</encryption>
         <parameters>
         </parameters>
      </ser:buscaFiltros>
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
 async getFiltersTablePrice(
  user: string,
  password: string,
  encryption: number
 ) {
  const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:buscaFiltrosTabelaPreco>
         <user>${user}</user>
         <password>${password}</password>
         <encryption>${encryption}</encryption>
         <parameters>
         </parameters>
      </ser:buscaFiltrosTabelaPreco>
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

 async gravarOrdensCompra(user: any, password: any, params: any) {
  const encryption = 0;

  const produtosXml = params.products
   .map(
    (p: any) => `
      <produtos>
        <codPro>${p.productCode}</codPro>
        <qtdPed>${p.orderQuantity}</qtdPed>
        <preUni>${p.unityPrice}</preUni>
      </produtos>`
   )
   .join("");

  const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
      <soapenv:Body>
        <ser:GravarOrdensCompra_8>
          <user>${user}</user>
          <password>${password}</password>
          <encryption>${encryption}</encryption>
          <parameters>
            <dadosGerais>
              <codCpg>${params.paymentCondition}</codCpg>
              <codEmp>${params.company}</codEmp>
              <codFil>${params.branch}</codFil>
              <codFor>${params.supplyerCode}</codFor>
              ${produtosXml}
            </dadosGerais>
            <fechaOC>1</fechaOC>
            <tipoProcessamento>1</tipoProcessamento>
            <identificadorSistema>IIP</identificadorSistema>
          </parameters>
        </ser:GravarOrdensCompra_8>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
   const { data } = await axios.post(
    `${this.url + this.buyingOrderModule}`,
    xmlBody,
    {
     headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: this.url + this.buyingOrderModule,
     },
     timeout: soapConfig.timeout,
     responseType: "arraybuffer",
     transformResponse: (r) => r,
    }
   );

   // 👇 Decodifica os bytes corretamente

   const parsed = await parseStringPromise(data, {
    explicitArray: false,
   });
   return parsed;
  } catch (error: any) {
   console.error("❌ Senior SOAP order error:", error.message);
   throw new Error("Failed to send buying order to Senior SOAP service.");
  }
 }
 async changePrice(user: any, password: any, tablePrice: any, products: any) {
  const encryption = 0;

  const produtosXml = products
   .map(
    (p: any) => `
      <produtos>
        <codigo>${p.productCode}</codigo>
        <prebas>${p.salePrice}</prebas>
        <precap>${p.capPrice}</precap>
      </produtos>`
   )
   .join("");
  const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
      <soapenv:Body>
        <ser:alteraPreco>
          <user>${user}</user>
          <password>${password}</password>
          <encryption>${encryption}</encryption>
          <parameters>
          <codtpr>${tablePrice}</codtpr>
              ${produtosXml}
          </parameters>
        </ser:alteraPreco>
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
     responseType: "arraybuffer",
     transformResponse: (r) => r,
    }
   );

   // 👇 Decodifica os bytes corretamente

   const parsed = await parseStringPromise(data, {
    explicitArray: false,
   });
   return parsed;
  } catch (error: any) {
   console.error("❌ Senior SOAP change price error:", error.message);
   throw new Error("Failed to change price into Senior SOAP service.");
  }
 }
 async importPrice(user: any, password: any, tablePrice: any, products: any) {
  const encryption = 0;

  const produtosXml = products
   .map(
    (p: any) => `
      <produtos>
        <codigo>${p.productCode}</codigo>
        <prebas>${p.salePrice}</prebas>
        <precap>${p.capPrice}</precap>
      </produtos>`
   )
   .join("");
  const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
      <soapenv:Body>
        <ser:importaPreco>
          <user>${user}</user>
          <password>${password}</password>
          <encryption>${encryption}</encryption>
          <parameters>
          <codtpr>${tablePrice}</codtpr>
              ${produtosXml}
          </parameters>
        </ser:importaPreco>
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
     responseType: "arraybuffer",
     transformResponse: (r) => r,
    }
   );

   // 👇 Decodifica os bytes corretamente

   const parsed = await parseStringPromise(data, {
    explicitArray: false,
   });
   return parsed;
  } catch (error: any) {
   console.error("❌ Senior SOAP change price error:", error.message);
   throw new Error("Failed to change price into Senior SOAP service.");
  }
 }
}
