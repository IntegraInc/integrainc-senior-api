import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { extractSoapFields } from "../../../shared/utils/soapParser";
import { redis } from "../../../config/redis";
import {
 mapFilterData,
 mapFilterTablePriceData,
} from "../../../shared/utils/jsonMapper";

export class FilterService {
 private seniorClient: SeniorClient;

 constructor() {
  this.seniorClient = new SeniorClient();
 }

 /**
  * Retorna os filtros do Senior com cache via Redis.
  * 1️⃣ Tenta buscar do cache.
  * 2️⃣ Se não existir, chama o SOAP e salva no cache por 1h.
  * 3️⃣ Retorna os dados ao controller.
  */
 async getFilters(user: string, password: string, encryption: number = 0) {
  const cacheKey = `senior:filters`;
  const ttlSeconds = 3600; // 1 hora

  try {
   // 1️⃣ Tenta pegar do cache
   const cachedData = await redis.get(cacheKey);
   if (cachedData) {
    console.log(`⚡ Cache hit para ${cacheKey}`);
    return {
     success: true,
     message: "Filters fetched from cache.",
     data: JSON.parse(cachedData),
    };
   }

   console.log(`🚀 Cache miss para ${cacheKey}. Buscando no Senior...`);

   // 2️⃣ Busca dados do Senior
   const response = await this.seniorClient.getFilters(
    user,
    password,
    encryption
   );
   const parsed = extractSoapFields(response, [
    "fornecedor",
    "condicaoPagamento",
    "formaPagamento",
    "familia",
   ]);

   if (parsed.error) {
    return {
     success: false,
     message: parsed.message,
     details: parsed.details,
    };
   }

   const mapped = mapFilterData(parsed.data);

   // 3️⃣ Armazena no Redis por 1h
   await redis.set(cacheKey, JSON.stringify(mapped), "EX", ttlSeconds);
   console.log(`💾 Cache atualizado para ${cacheKey}`);

   return {
    success: true,
    message: "Filtros buscados com sucesso.",
    data: mapped,
   };
  } catch (error: any) {
   console.error("❌ Erro ao buscar filtros: ", error.message);
   return {
    success: false,
    message: "Erro ao buscar filtros.",
    details: error.message,
   };
  }
 }
 async getFiltersTablePrice(
  user: string,
  password: string,
  encryption: number = 0
 ) {
  //   const cacheKey = `senior:filters-table-price`;
  //   const ttlSeconds = 3600; // 1 hora

  try {
   // 1️⃣ Tenta pegar do cache
   //    const cachedData = await redis.get(cacheKey);
   //    if (cachedData) {
   //     console.log(`⚡ Cache hit para ${cacheKey}`);
   //     return {
   //      success: true,
   //      message: "Filters fetched from cache.",
   //      data: JSON.parse(cachedData),
   //     };
   //    }

   //    console.log(`🚀 Cache miss para ${cacheKey}. Buscando no Senior...`);

   // 2️⃣ Busca dados do Senior
   const response = await this.seniorClient.getFiltersTablePrice(
    user,
    password,
    encryption
   );
   const parsed = extractSoapFields(response, ["tabelaPreco"]);

   if (parsed.error) {
    return {
     success: false,
     message: parsed.message,
     details: parsed.details,
    };
   }

   const mapped = mapFilterTablePriceData(parsed.data);

   // 3️⃣ Armazena no Redis por 1h
   //    await redis.set(cacheKey, JSON.stringify(mapped), "EX", ttlSeconds);
   //    console.log(`💾 Cache atualizado para ${cacheKey}`);

   return {
    success: true,
    message: "Filtros buscados com sucesso.",
    data: mapped,
   };
  } catch (error: any) {
   console.error("❌ Erro ao buscar filtros:", error.message);
   return {
    success: false,
    message: "Error fetching filters.",
    details: error.message,
   };
  }
 }
 async refreshRedis() {
  try {
   await redis.del(`senior:filters`);
   return {
    success: true,
    message: "Filters cache refreshed.",
   };
  } catch (error: any) {
   console.error("❌ Error refreshing filters cache:", error.message);
   return {
    success: false,
    message: "Error refreshing filters cache.",
    details: error.message,
   };
  }
 }
}
