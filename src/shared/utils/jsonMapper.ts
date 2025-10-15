/**
 * Maps Senior product fields into frontend-friendly JSON fields.
 * Converts uppercase database fields into readable camelCase keys.
 */

export function mapProductData(products: any[]) {
 return products.map((p) => ({
  // Basic product info
  productCode: p.CODPRO,
  barcode: p.CODBAR,
  description: p.DESPRO,
  origin: p.DESORI,
  family: p.DESFAM,
  status: p.SITPRO,

  // Pricing info
  basePrice: p.PREBAS,
  lastCost: p.USU_PRECUS,
  avgCost: p.USU_PRECAP,

  // Calculated financial metrics
  discountCap: p.DESCONTO_CAPA,
  margin: p.MARGEM,
  markup: p.MARKUP,

  // Automatic pricing targets
  autoTargetMargin: p.AUTOMATICO_PRECO_MARGEM_ALVO,
  autoTargetMarkup: p.AUTOMATICO_PRECO_MARKUP_ALVO,

  // Stock & logistics
  stock: p.ESTOQUE,
  minStock: p.ESTMIN,
  lastPurchaseDate: p.DATA_ULTIMA_COMPRA,

  // Sales metrics
  sales3Months: p.QTDVEN3M,
  weightedAverage: p.MEDIA_PONDERADA,
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
