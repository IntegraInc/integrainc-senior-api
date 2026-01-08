import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { getSeniorCredentialsFromToken } from "../../../shared/utils/jwt";

/**
 * @openapi
 * /products/all:
 *   get:
 *     summary: Lista produtos com análise de custo, margem e preços sugeridos
 *     description: >
 *       Retorna uma lista paginada de produtos já mapeados para o front, incluindo:
 *       custo da última compra, preço de venda, percentuais de markup e margem, e
 *       preços sugeridos com base nos parâmetros informados.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         description: "Número da página (0-based)."
 *         schema:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *       - name: limit
 *         in: query
 *         required: true
 *         description: "Quantidade de itens por página."
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 50
 *       - name: tablePrice
 *         in: query
 *         required: true
 *         description: "Código da tabela de preços (ex.: TPW, TPM)."
 *         schema:
 *           type: string
 *           example: "TPW"
 *       - name: markup
 *         in: query
 *         required: false
 *         description: "Percentual de markup para cálculo de preço sugerido (ex.: 10 = 10%)."
 *         schema:
 *           type: number
 *           format: float
 *           example: 10
 *       - name: margin
 *         in: query
 *         required: false
 *         description: "Percentual de margem para cálculo de preço sugerido (ex.: 10 = 10%)."
 *         schema:
 *           type: number
 *           format: float
 *           example: 10
 *     responses:
 *       200:
 *         description: "Lista de produtos retornada com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *             examples:
 *               default:
 *                 summary: Exemplo de resposta
 *                 value:
 *                   success: true
 *                   message: "Produtos buscados com sucesso."
 *                   data:
 *                     - productCode: "0100002"
 *                       barcode: "7898521815981"
 *                       description: "Bíblia de Estudo do Expositor | Letra Normal | NTVE | Capa Couro Vinho"
 *                       familyName: "SBB"
 *                       familyCode: "010"
 *                       category: "LIVROS"
 *                       lastPurchaseCost: "R$137,56"
 *                       capPrice: 0
 *                       capPercent: 35
 *                       salePrice: 227.435
 *                       markupPercent: 65.34
 *                       marginPercent: 39.52
 *                       suggestedPriceByMargin: 137.46
 *                       suggestedPriceByMarkup: 137.66
 *                       availableStock: 8
 *                       lastPurchaseDate: "19/11/2025"
 *       400:
 *         description: "Parâmetros ausentes ou inválidos."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingTablePrice:
 *                 summary: Falta tablePrice
 *                 value:
 *                   success: false
 *                   message: "You must provide table price"
 *       401:
 *         description: "Falha de autenticação (Bearer token ausente ou inválido)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noAuth:
 *                 value:
 *                   success: false
 *                   message: "Missing or invalid Authorization header."
 *       404:
 *         description: "Produtos não encontrados ou erro na consulta ao ERP."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   message: "No products found."
 *                   details: "Senior ERP did not return data"
 *       500:
 *         description: "Erro interno inesperado."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ProductItem:
 *       type: object
 *       properties:
 *         productCode:
 *           type: string
 *           example: "0100002"
 *         barcode:
 *           type: string
 *           description: "Pode ser grande; retornar como string evita perda de precisão."
 *           example: "7898521815981"
 *         description:
 *           type: string
 *           example: "Bíblia de Estudo do Expositor | Letra Normal | NTVE | Capa Couro Vinho"
 *         familyName:
 *           type: string
 *           example: "SBB"
 *         familyCode:
 *           type: string
 *           example: "010"
 *         category:
 *           type: string
 *           example: "LIVROS"
 *         lastPurchaseCost:
 *           type: string
 *           description: "Valor formatado em moeda (pt-BR)."
 *           example: "R$137,56"
 *         capPrice:
 *           type: number
 *           format: float
 *           example: 0
 *         capPercent:
 *           type: number
 *           format: float
 *           example: 35
 *         salePrice:
 *           type: number
 *           format: float
 *           example: 227.435
 *         markupPercent:
 *           type: number
 *           format: float
 *           example: 65.34
 *         marginPercent:
 *           type: number
 *           format: float
 *           example: 39.52
 *         suggestedPriceByMargin:
 *           type: number
 *           format: float
 *           example: 137.46
 *         suggestedPriceByMarkup:
 *           type: number
 *           format: float
 *           example: 137.66
 *         availableStock:
 *           type: integer
 *           example: 8
 *         lastPurchaseDate:
 *           type: string
 *           description: "Data no formato dd/MM/yyyy."
 *           example: "19/11/2025"
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Produtos buscados com sucesso."
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductItem'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         details:
 *           type: string
 */

export class ProductsController {
 private service: ProductService;

 constructor() {
  this.service = new ProductService();
 }

 async getProducts(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(401).json({
    success: false,
    message: "Missing or invalid Authorization header.",
   });
  }

  const token = authHeader.split(" ")[1];
  const { username, password } = await getSeniorCredentialsFromToken(token);
  const { page, limit, tablePrice, markup, margin } = req.query;

  if (!tablePrice) {
   return res.status(400).json({ error: "You must provide table price" });
  }

  try {
   const result = await this.service.getProducts(
    username,
    password,
    limit,
    page,
    tablePrice as string,
    markup,
    margin
   );
   if (!result.success) {
    return res.status(404).json(result);
   }
   return res.json(result);
  } catch (error: any) {
   console.error("Login error:", error.message);
   return res
    .status(404)
    .json({ error: "Authentication failed.", details: error.message });
  }
 }

 /**
  * @openapi
  * /products/change-price:
  *   post:
  *     summary: Atualiza preços em uma tabela de preços
  *     description: "Recebe produtos do frontend, escolhe o preço conforme `typePrice` e envia para o serviço da Senior (incluindo `capPrice`)."
  *     tags:
  *       - Products
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/ChangePriceRequest'
  *           examples:
  *             margem:
  *               summary: Exemplo usando typePrice = margem
  *               value:
  *                 tablePrice: "TPW"
  *                 typePrice: "margem"
  *                 products:
  *                   - productCode: "0100002"
  *                     salePrice: 227.43
  *                     suggestedPriceByMargin: 137.46
  *                     suggestedPriceByMarkup: 137.66
  *                     capPrice: 100
  *             markup:
  *               summary: Exemplo usando typePrice = markup
  *               value:
  *                 tablePrice: "TPM"
  *                 typePrice: "markup"
  *                 products:
  *                   - productCode: "0000000001"
  *                     salePrice: 120.5
  *                     suggestedPriceByMargin: 118.0
  *                     suggestedPriceByMarkup: 125.0
  *                     capPrice: 90
  *             price:
  *               summary: Exemplo usando typePrice = price (usa salePrice do front)
  *               value:
  *                 tablePrice: "TPM"
  *                 typePrice: "price"
  *                 products:
  *                   - productCode: "0000000002"
  *                     salePrice: 220.75
  *                     suggestedPriceByMargin: 235.0
  *                     suggestedPriceByMarkup: 240.0
  *                     capPrice: 0
  *     responses:
  *       200:
  *         description: "Preços enviados/atualizados com sucesso."
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ChangePriceResponse'
  *             examples:
  *               ok:
  *                 value:
  *                   success: true
  *                   message: "Alterações de preço enviadas com sucesso."
  *                   data:
  *                     response: "OK"
  *       400:
  *         description: "Parâmetros ausentes ou corpo inválido."
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *             examples:
  *               badRequest:
  *                 value:
  *                   success: false
  *                   message: "tablePrice e products são obrigatórios."
  *       401:
  *         description: "Falha de autenticação."
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *             examples:
  *               noAuth:
  *                 value:
  *                   success: false
  *                   message: "Missing or invalid Authorization header."
  *       404:
  *         description: "Erro na integração ou recurso não encontrado."
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *             examples:
  *               notFound:
  *                 value:
  *                   success: false
  *                   message: "Senior ERP did not return data"
  *       500:
  *         description: "Erro interno inesperado."
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *
  * components:
  *   securitySchemes:
  *     bearerAuth:
  *       type: http
  *       scheme: bearer
  *       bearerFormat: JWT
  *   schemas:
  *     ChangePriceProduct:
  *       type: object
  *       required: [productCode, salePrice, suggestedPriceByMargin, suggestedPriceByMarkup, capPrice]
  *       properties:
  *         productCode:
  *           type: string
  *           example: "0100002"
  *         salePrice:
  *           type: number
  *           format: float
  *           description: "Preço de venda informado pelo front; usado quando typePrice = 'price'."
  *           example: 227.43
  *         suggestedPriceByMargin:
  *           type: number
  *           format: float
  *           description: "Preço sugerido pela margem; usado quando typePrice = 'margem'."
  *           example: 137.46
  *         suggestedPriceByMarkup:
  *           type: number
  *           format: float
  *           description: "Preço sugerido pelo markup; usado quando typePrice = 'markup'."
  *           example: 137.66
  *         capPrice:
  *           type: number
  *           format: float
  *           description: "Preço de capa enviado pelo front; sempre encaminhado ao ERP."
  *           example: 100
  *     ChangePriceRequest:
  *       type: object
  *       required: [tablePrice, typePrice, products]
  *       properties:
  *         tablePrice:
  *           type: string
  *           description: "Código da tabela de preços (ex.: TPW, TPM)."
  *           example: "TPW"
  *         typePrice:
  *           type: string
  *           description: "Define qual preço aplicar no envio ao ERP."
  *           enum: ["price", "margem", "markup"]
  *           example: "margem"
  *         products:
  *           type: array
  *           minItems: 1
  *           items:
  *             $ref: '#/components/schemas/ChangePriceProduct'
  *     ChangePriceResponse:
  *       type: object
  *       properties:
  *         success:
  *           type: boolean
  *           example: true
  *         message:
  *           type: string
  *           example: "Alterações de preço enviadas com sucesso."
  *         data:
  *           type: object
  *           description: "Conteúdo retornado pela operação SOAP da Senior."
  *           properties:
  *             response:
  *               type: string
  *               example: "OK"
  *     ErrorResponse:
  *       type: object
  *       properties:
  *         success:
  *           type: boolean
  *           example: false
  *         message:
  *           type: string
  *         details:
  *           type: string
  */

 async changePrice(req: Request, res: Response) {
  try {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
     success: false,
     message: "Missing or invalid Authorization header.",
    });
   }

   const token = authHeader.split(" ")[1];
   const { username, password } = await getSeniorCredentialsFromToken(token);

   const result = await this.service.changePrice(username, password, req.body);

   return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
   console.error("❌ Buying order controller error:", error.message);
   return res.status(500).json({
    success: false,
    message: "Error sending buying order.",
    details: error.message,
   });
  }
 }
 /**
  * @openapi
  * /products/import-price:
  *   post:
  *     summary: Importa preços para uma Tabela de Preço e retorna os itens alterados
  *     description: >
  *       Recebe uma lista de produtos com SKU, Preço de Venda e Preço Capa para uma
  *       Tabela de Preço específica. O serviço atualiza os preços no Senior e retorna,
  *       no campo "data", apenas os itens efetivamente alterados já no formato completo da tabela.
  *     tags:
  *       - Products
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - tablePrice
  *               - products
  *             properties:
  *               tablePrice:
  *                 type: string
  *                 example: "TII"
  *               products:
  *                 type: array
  *                 items:
  *                   type: object
  *                   required:
  *                     - productCode
  *                     - salePrice
  *                     - capPrice
  *                   properties:
  *                     productCode:
  *                       type: string
  *                       example: "9040000"
  *                     salePrice:
  *                       type: number
  *                       example: 5
  *                     capPrice:
  *                       type: number
  *                       example: 20
  *     responses:
  *       '200':
  *         description: Sucesso — itens atualizados retornados no campo "data".
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success:
  *                   type: boolean
  *                   example: true
  *                 message:
  *                   type: string
  *                   example: "Preços atualizados com sucesso."
  *                 data:
  *                   type: array
  *                   items:
  *                     type: object
  *                     properties:
  *                       productCode: { type: string, example: "0100002" }
  *                       barcode: { type: number, example: 7898521815981 }
  *                       description: { type: string, example: "Bíblia de Estudo do Expositor | NTVE | Capa Couro Vinho" }
  *                       familyName: { type: string, example: "SBB" }
  *                       familyCode: { type: string, example: "010" }
  *                       category: { type: string, example: "LIVROS" }
  *                       lastPurchaseCost: { type: number, example: 137.56 }
  *                       capPrice: { type: number, example: 100 }
  *                       capPercent: { type: number, example: 37.56 }
  *                       salePrice: { type: number, example: 227.43 }
  *                       markupPercent: { type: number, example: 65.33 }
  *                       marginPercent: { type: number, example: 39.52 }
  *                       suggestedPriceByMargin: { type: number, example: 0 }
  *                       suggestedPriceByMarkup: { type: number, example: 0 }
  *                       availableStock: { type: number, example: 1 }
  *                       lastPurchaseDate: { type: string, example: "30/12/2025" }
  *       '401':
  *         description: "Header de autorização ausente ou inválido (Authorization: Bearer <token>)."
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success: { type: boolean, example: false }
  *                 message: { type: string, example: "Missing or invalid Authorization header." }
  *       '500':
  *         description: Erro interno ao processar/reenviar para o Senior.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success: { type: boolean, example: false }
  *                 message: { type: string, example: "Error sending file to Senior." }
  *                 details: { type: string, example: "mensagem de erro detalhada" }
  */

 async importPrice(req: Request, res: Response) {
  try {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
     success: false,
     message: "Missing or invalid Authorization header.",
    });
   }

   const token = authHeader.split(" ")[1];
   const { username, password } = await getSeniorCredentialsFromToken(token);

   const result = await this.service.importPrice(username, password, req.body);

   return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
   console.error("❌ import file controller error:", error.message);
   return res.status(500).json({
    success: false,
    message: "Error sending file to Senior.",
    details: error.message,
   });
  }
 }
}
