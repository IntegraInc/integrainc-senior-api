import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { mapProductData } from "../../../shared/utils/jsonMapper";
import { getSeniorCredentialsFromToken } from "../../../shared/utils/jwt";
import { extractSoapFields } from "../../../shared/utils/soapParser";

export class ProductService {
 private seniorClient: SeniorClient;

 constructor() {
  this.seniorClient = new SeniorClient();
 }

 async getProducts(limit: any, page: any) {
  const response = await this.seniorClient.exportTablePrice(limit, page);

  const parsed = extractSoapFields<{ response?: string }>(response, [
   "response",
  ]);

  // 🧠 Case 1: SOAP execution failure
  if (parsed.error) {
   return {
    success: false,
    message: parsed.message,
    details: parsed.details,
   };
  }

  const base64Data = parsed.data?.response;

  if (!base64Data) {
   return {
    success: false,
    message: "No Base64 data found in SOAP response.",
   };
  }

  try {
   // 🔍 Decode Base64 → string
   const decoded = Buffer.from(base64Data, "base64").toString("latin1");

   // 🧩 Parse JSON safely
   const jsonData = JSON.parse(decoded);

   // ✅ Translate field names
   const mapped = mapProductData(jsonData);

   return {
    success: true,
    message: "Products fetched successfully.",
    data: mapped,
   };
  } catch (error: any) {
   return {
    success: false,
    message: "Erro ao buscar lista de produtos.",
    details: error.message,
   };
  }
 }
 async sendBuyingOrder(user: string, password: string, orderData: any) {
  try {
   const response = await this.seniorClient.gravarOrdensCompra(
    user,
    password,
    orderData
   );

   const parsed = extractSoapFields<{ response?: string }>(response, [
    "result",
   ]);

   if (parsed.error) {
    return {
     success: false,
     message: parsed.message,
     details: parsed.details,
    };
   }

   const base64Data = parsed.data?.response;
   if (!base64Data) {
    return {
     success: false,
     message: "No Base64 data found in SOAP response.",
    };
   }

   const decoded = Buffer.from(base64Data, "base64").toString("latin1");
   const jsonData = JSON.parse(decoded);

   return {
    success: true,
    message: "Buying order sent successfully.",
    data: jsonData,
   };
  } catch (error: any) {
   return {
    success: false,
    message: "Erro ao enviar ordem de compra.",
    details: error.message,
   };
  }
 }
}
