import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { mapProductData } from "../../../shared/utils/jsonMapper";
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
    message: "Failed to decode or parse Base64 JSON.",
    details: error.message,
   };
  }
 }
}
