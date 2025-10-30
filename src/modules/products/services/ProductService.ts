import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { mapProductData } from "../../../shared/utils/jsonMapper";
import { getSeniorCredentialsFromToken } from "../../../shared/utils/jwt";
import { extractSoapFields } from "../../../shared/utils/soapParser";

export class ProductService {
 private seniorClient: SeniorClient;

 constructor() {
  this.seniorClient = new SeniorClient();
 }

 async getProducts(
  user: string,
  password: string,
  encryption: number,
  limit: any,
  page: any,
  tablePrice: string
 ) {
  const response = await this.seniorClient.exportTablePrice(
   user,
   password,
   encryption,
   limit,
   page,
   tablePrice
  );

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
    message: "Produtos buscados com sucesso.",
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
    "dadosRetorno",
   ]);

   if (parsed.error) {
    return {
     success: false,
     message: parsed.message,
     details: parsed.details,
    };
   }

   return {
    success: true,
    message: "Ordem de compra gerada com sucesso.",
    data: parsed.data,
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
