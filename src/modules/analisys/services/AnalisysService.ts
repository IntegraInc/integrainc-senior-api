import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { getCache, setCache } from "../../../shared/utils/cache";
import {
 mapAnalisysData,
 mapProductData,
} from "../../../shared/utils/jsonMapper";
import { getSeniorCredentialsFromToken } from "../../../shared/utils/jwt";
import { extractSoapFields } from "../../../shared/utils/soapParser";

export class AnalisysService {
 private seniorClient: SeniorClient;

 constructor() {
  this.seniorClient = new SeniorClient();
 }

 async getAnalysis(
  user: string,
  password: string,
  encryption: number,
  limit: any = 999999,
  page: any = 1
 ) {
  const cacheKey = `analysis:${user}:${limit}:${page}`;

  // 1️⃣ Tenta pegar do cache
  const cached = await getCache<any>(cacheKey);
  if (cached) {
   console.log("✅ Cache hit → analysis");
   return {
    success: true,
    message: "Análise carregada do cache.",
    data: cached,
   };
  }

  console.log("🔄 Cache miss → consultando SOAP...");

  // 2️⃣ Executa chamada SOAP
  const response = await this.seniorClient.exportAnalisys(
   user,
   password,
   encryption,
   limit,
   page
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
   const mapped = mapAnalisysData(jsonData);

   // 3️⃣ Armazena no cache por 5 minutos (300 segundos)
   await setCache(cacheKey, mapped, 300);

   return {
    success: true,
    message: "Análise de reposição buscada com sucesso.",
    data: mapped,
   };
  } catch (error: any) {
   return {
    success: false,
    message: "Erro ao buscar lista de análise de reposição.",
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

   const parsed = extractSoapFields<{ dadosRetorno?: any }>(response, [
    "dadosRetorno",
   ]);

   if (parsed.error) {
    return {
     success: false,
     message: parsed.message,
     details: parsed.details,
    };
   }

   const orderNumber = parsed.data?.dadosRetorno?.numOcp;

   return {
    success: true,
    message: "Ordem de compra gerada com sucesso.",
    data: { orderNumber: orderNumber },
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
