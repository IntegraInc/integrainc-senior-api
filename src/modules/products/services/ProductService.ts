import { SeniorClient } from "../../../infra/soap/SeniorClient";
import { getCache, setCache } from "../../../shared/utils/cache";
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
  limit: any,
  page: any,
  tablePrice: string,
  markup: any,
  margin: any
 ) {
  const tablePriceKey = tablePrice;
  const cacheKey = `products:${user}:${tablePriceKey}:${limit ?? 9999}:${
   page ?? 1
  }:${markup ?? 0}:${margin ?? 0}`;
  const cached = await getCache<any>(cacheKey);
  if (
   cached &&
   typeof cached === "object" &&
   "data" in cached &&
   Array.isArray(cached.data)
  ) {
   console.log(
    `✅ Cache hit → products (${cached.data.length} itens na página ${page})`
   );
   return cached;
  }

  console.log("🔄 Cache miss → consultando SOAP...");

  const response = await this.seniorClient.exportTablePrice(
   user,
   password,
   limit ?? 9999,
   page ?? 1,
   tablePrice,
   markup ?? 0,
   margin ?? 0
  );

  const parsed = extractSoapFields<{ response?: any }>(response, ["response"]);

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

   // 🚫 Se veio vazio, não cacheia
   const hasItems = Array.isArray(mapped)
    ? mapped.length > 0
    : !!mapped && Object.keys(mapped).length > 0;

   const cachePayload = {
    success: true,
    message: "Producos buscados com sucesso.",
    data: mapped,
   };
   if (hasItems) {
    await setCache(cacheKey, cachePayload, 300);
    console.log(
     `🔒 Cache set → ${cacheKey} (${
      Array.isArray(mapped) ? mapped.length : "n/a"
     } itens)`
    );
   } else {
    console.warn(`⚠️ Nenhum item retornado. Cache não gravado (${cacheKey}).`);
   }

   return cachePayload;
  } catch (error: any) {
   return {
    success: false,
    message: "Erro ao buscar lista de produtos.",
    details: error.message,
   };
  }
 }
 async changePrice(user: string, password: string, priceData: any) {
  try {
   /**
    * Exemplo esperado:
    * {
    *   tablePrice: "TPM",
    *   typePrice: "margem" | "markup" | "price",
    *   products: [
    *     { productCode: "0000000001", salePrice: 120, suggestedPriceByMargin: 135, suggestedPriceByMarkup: 140 }
    *   ]
    * }
    */

   // 🔁 Monta os produtos conforme o tipo selecionado
   let mappedProducts = [];

   switch (priceData.typePrice) {
    case "price":
     mappedProducts = priceData.products.map((p: any) => ({
      productCode: p.productCode,
      salePrice: p.salePrice,
      capPrice: p.capPrice ?? 0,
     }));
     break;

    case "margem":
     mappedProducts = priceData.products.map((p: any) => ({
      productCode: p.productCode,
      salePrice: p.suggestedPriceByMargin,
      capPrice: p.capPrice ?? 0,
     }));
     break;

    case "markup":
    default:
     mappedProducts = priceData.products.map((p: any) => ({
      productCode: p.productCode,
      salePrice: p.suggestedPriceByMarkup,
      capPrice: p.capPrice ?? 0,
     }));
     break;
   }

   // 🧩 Monta objeto final para o serviço SOAP
   const payload = {
    tablePrice: priceData.tablePrice,
    products: mappedProducts,
   };

   // 🚀 Envia para o serviço SOAP da Senior
   const response = await this.seniorClient.changePrice(
    user,
    password,
    payload.tablePrice,
    payload.products
   );

   const parsed = extractSoapFields<{ response?: string }>(response, [
    "response",
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
    message: "Preços atualizados com sucesso.",
    data: mappedProducts,
   };
  } catch (error: any) {
   return {
    success: false,
    message: "Erro ao enviar atualização de preços.",
    details: error.message,
   };
  }
 }
}
