/**
 * Maps Senior product fields into frontend-friendly JSON fields.
 * Converts uppercase database fields into readable camelCase keys.
 */

import { formatDate } from "./formatters";

export function mapAnalisysData(products: any[]) {
 return products.map((p) => ({
  // 🔹 Basic product information
  productCode: p.CODPRO,
  barcode: p.CODBAR,
  description: p.DESPRO,
  familyName: p.DESFAM,
  familyCode: p.CODFAM,
  // 🔹 Pricing information
  lastPurchaseCost: p.PRECUS ? p.PRECUS : 0, // Last cost
  // 🔹 Inventory information
  availableStock: p.ESTOQUE_DISPONIVEL ? p.ESTOQUE_DISPONIVEL : 0, // Available (free) stock
  physicalStock: p.ESTOQUE_FISICO ? p.ESTOQUE_FISICO : 0, // Physical stock
  minStock: p.ESTMIN, // Minimum stock (safety)
  lastPurchaseDate: formatDate(p.DATA_ULTIMA_COMPRA)
   ? formatDate(p.DATA_ULTIMA_COMPRA)
   : " ", // Last purchase date

  // 🔹 Sales metrics
  //   salesLast3Months: p.QTDVEN3M, // Quantity sold in last 3 months
  stockTurnover: p.GIRO_ESTOQUE ? p.GIRO_ESTOQUE : 0, // Stock turnover rate
  weightedAveragePrice: p.MEDIA_PONDERADA ? p.MEDIA_PONDERADA : 0, // Weighted average price -inativado
  purchaseSuggestion: p.SUGESTAO_COMPRA ? p.SUGESTAO_COMPRA : 0, // Suggested purchase qty
  quantityToBuy: p.SUGESTAO_COMPRA ? p.SUGESTAO_COMPRA : 0, // Qty recommended to buy
  totalSales: p.VENDAS_TOTAL ? p.VENDAS_TOTAL : 0, // Total sales sum
  average6Months: p.MEDIA_6M ? p.MEDIA_6M : 0, // Average sales over last 6 months

  // 🔹 Monthly sales (array of months and totals)
  monthlySales: p.VENDAS_MENSAL?.map((m: any) => ({
   month: m.MES,
   total: m.TOTAL ? m.TOTAL : 0,
  })),

  // 🔹 Average of last 6 months (already computed in SQL)
 }));
}
export function mapProductData(products: any[]) {
 return products.map((p) => ({
  // 🔹 Basic product information
  productCode: p.CODPRO,
  barcode: p.CODBAR,
  description: p.DESPRO,
  familyName: p.DESFAM,
  familyCode: p.CODFAM,
  category: p.DESMAR,

  // 🔹 Pricing information
  lastPurchaseCost: p.PRECUS, // Custo de aquisição (último custo)
  avgCost: p.PRECAP, // Custo médio / ajustado
  discountPercent: p.PERCAP, // Percentual de desconto aplicado
  markupPercent: p.MARKUP, // Markup configurado
  marginPercent: p.MARGEM_PERCENTUAL, // Margem real calculada
  suggestedPriceByMargin: p.PRECO_SUGERIDO_MARGEM, // Preço sugerido baseado na margem real
  suggestedPriceByMarkup: p.PRECO_SUGERIDO_MARKUP, // Preço sugerido baseado no markup

  // 🔹 Inventory information
  availableStock: p.ESTOQUE_DISPONIVEL, // Estoque disponível
  lastPurchaseDate: p.DATA_ULTIMA_COMPRA, // Última data de compra

  // 🔹 Metadata / derived info (optional placeholders)
  // physicalStock: p.ESTOQUE_FISICO,       // se vier depois, manter estrutura
  // minStock: p.ESTMIN,                    // caso adicione o campo futuramente
 }));
}

export function mapFilterData(filters: any) {
 return {
  supplyer: (filters.fornecedor || []).map((f: any) => ({
   code: f.codigo,
   name: f.nome,
  })),
  paymentCondition: (filters.condicaoPagamento || []).map((c: any) => ({
   code: c.codigo,
   name: c.nome,
  })),
  paymentMethod: (filters.formaPagamento || []).map((f: any) => ({
   code: f.codigo,
   name: f.nome,
  })),
  family: (filters.familia || []).map((f: any) => ({
   code: f.codigo,
   name: f.codigo + "-" + f.nome,
  })),
 };
}
export function mapFilterTablePriceData(filters: any) {
 return {
  tablePrice: (filters.tabelaPreco || []).map((f: any) => ({
   code: f.codigo,
  })),
 };
}
