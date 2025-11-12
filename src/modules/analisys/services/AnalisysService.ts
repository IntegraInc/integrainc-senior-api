import { parse } from "path";
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
  limit: any,
  page: any,
  family?: any
 ) {
  const cacheKey = `analysis:${user}:${limit}:${page}:${family}`;

  // 1️⃣ Tenta pegar do cache
  const cached = await getCache<any>(cacheKey);
  if (cached) {
   console.log("✅ Cache hit → analysis");
   return cached;
  }

  console.log("🔄 Cache miss → consultando SOAP...");

  // 2️⃣ Executa chamada SOAP
  const response = await this.seniorClient.exportAnalisys(
   user,
   password,
   encryption,
   limit,
   page,
   family
  );
  const parsed = extractSoapFields<{ dados?: string; paginacao?: any }>(
   response,
   ["dados", "paginacao"]
  );

  // 🧠 Caso de erro no SOAP
  if (parsed.error) {
   return {
    success: false,
    message: parsed.message,
    details: parsed.details,
   };
  }

  const base64Data = parsed.data?.dados;
  const pagination = {
   totalItems: Number(parsed.data?.paginacao?.totalRegistros) || 0,
   totalPages: Number(parsed.data?.paginacao?.totalPaginas) || 0,
   currentPage: page,
  };

  if (!base64Data) {
   return {
    success: false,
    message: "Nenhum dado Base64 encontrado na resposta SOAP.",
   };
  }

  try {
   // 🔍 Decode Base64 → string JSON
   const decoded = Buffer.from(base64Data, "base64").toString("latin1");
   const jsonData = JSON.parse(decoded);

   // 🧩 Mapeia campos pro formato frontend-friendly
   const mapped = mapAnalisysData(jsonData);

   const cachePayload = {
    success: true,
    message: "Análise de reposição buscada com sucesso.",
    pagination,
    data: mapped,
   };
   // 3️⃣ Armazena no cache por 5 minutos (300 segundos)
   await setCache(cacheKey, cachePayload, 300);

   return {
    success: true,
    message: "Análise de reposição buscada com sucesso.",
    pagination,
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
