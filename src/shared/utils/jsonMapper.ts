/**
 * Maps Senior product fields into frontend-friendly JSON fields.
 * Converts uppercase database fields into readable camelCase keys.
 */

export function mapProductData(products: any[]) {
 return products.map((p) => ({
  // 🔹 Basic product information
  productCode: p.CODPRO,
  barcode: p.CODBAR,
  description: p.DESPRO,
  family: p.DESFAM,
  // 🔹 Pricing information
  lastPurchaseCost: p.PRECUS, // Last cost
  // 🔹 Inventory information
  availableStock: p.ESTOQUE_DISPONIVEL, // Available (free) stock
  physicalStock: p.ESTOQUE_FISICO, // Physical stock
  minStock: p.ESTMIN, // Minimum stock (safety)
  lastPurchaseDate: p.DATA_ULTIMA_COMPRA, // Last purchase date

  // 🔹 Sales metrics
  //   salesLast3Months: p.QTDVEN3M, // Quantity sold in last 3 months
  stockTurnover: p.GIRO_ESTOQUE, // Stock turnover rate
  weightedAveragePrice: p.MEDIA_PONDERADA, // Weighted average price
  purchaseSuggestion: p.SUGESTAO_COMPRA, // Suggested purchase qty
  quantityToBuy: p.QTD_COMPRAR, // Qty recommended to buy
  totalSales: p.VENDAS_TOTAL, // Total sales sum
  average6Months: p.MEDIA_6M,

  // 🔹 Monthly sales (array of months and totals)
  monthlySales: p.VENDAS_MENSAL?.map((m: any) => ({
   month: m.MES,
   total: m.TOTAL,
  })),

  // 🔹 Average of last 6 months (already computed in SQL)
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
   name: f.nome,
  })),
 };
}
