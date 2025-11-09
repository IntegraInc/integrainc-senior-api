import { Request, Response } from "express";
import { AnalisysService } from "../services/AnalisysService";
import { getSeniorCredentialsFromToken } from "../../../shared/utils/jwt";

/**
 * @openapi
 * /analisys/all:
 *   get:
 *     summary: Get paginated products list by replacing Analisys data
 *     security:
 *      - bearerAuth: []   # 👈 Requires JWT
 *     description: Returns a paginated list of products from Senior, mapped into frontend-friendly fields.
 *     tags:
 *       - Analisys
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         description: Page number to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: true
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *           example: 50
 *       - name: family
 *         in: query
 *         required: false
 *         description: Product family filter
 *         schema:
 *           type: string
 *           example: "010"
 *     responses:
 *       200:
 *         description: Analysis data fetched successfully
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
 *                   example: Análise de reposição buscada com sucesso.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 250
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 5
 *                     limit:
 *                       type: integer
 *                       example: 250
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productCode:
 *                         type: string
 *                         example: "0200458"
 *                       barcode:
 *                         type: number
 *                         example: 9786559883493
 *                       description:
 *                         type: string
 *                         example: "Quinze Minutos Para o Pôr do Sol | Isabela Freixo"
 *                       familyName:
 *                         type: string
 *                         example: "MUNDO CRISTÃO"
 *                       familyCode:
 *                         type: string
 *                         example: "020"
 *                       lastPurchaseCost:
 *                         type: string
 *                         example: "R$29,21"
 *                       availableStock:
 *                         type: number
 *                         example: 13
 *                       physicalStock:
 *                         type: number
 *                         example: 13
 *                       minStock:
 *                         type: number
 *                         example: 17
 *                       lastPurchaseDate:
 *                         type: string
 *                         example: "25/09/2025"
 *                       stockTurnover:
 *                         type: number
 *                         example: 9
 *                       weightedAveragePrice:
 *                         type: string
 *                         example: "R$29,21"
 *                       purchaseSuggestion:
 *                         type: number
 *                         example: 10
 *                       quantityToBuy:
 *                         type: number
 *                         example: 10
 *                       totalSales:
 *                         type: number
 *                         example: 58
 *                       average6Months:
 *                         type: number
 *                         example: 19.33
 *                       monthlySales:
 *                         type: array
 *                         description: Historical monthly sales (last 6 months)
 *                         items:
 *                           type: object
 *                           properties:
 *                             month:
 *                               type: string
 *                               example: "SEP/2025"
 *                             total:
 *                               type: number
 *                               example: 22
 *       401:
 *         description: Missing or invalid authorization header
 *       500:
 *         description: Internal error or SOAP service failure
 */

export class AnalisysController {
 private service: AnalisysService;

 constructor() {
  this.service = new AnalisysService();
 }

 async getAnalisys(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(401).json({
    success: false,
    message: "Missing or invalid Authorization header.",
   });
  }

  const token = authHeader.split(" ")[1];
  const { username, password } = await getSeniorCredentialsFromToken(token);
  const { page, limit, family } = req.query;

  if (!page || !limit) {
   return res.status(400).json({ error: "You must provide page and limit" });
  }

  try {
   const result = await this.service.getAnalysis(
    username,
    password,
    0,
    limit,
    page,
    family
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
  * /analisys/buying-order:
  *   post:
  *     summary: Send a Buying Order (Ordem de Compra) to Senior ERP
  *     description: Creates a new buying order in Senior ERP using the SOAP service `GravarOrdensCompra_8`.
  *     security:
  *      - bearerAuth: []
  *     tags:
  *       - Analisys
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - paymentCondition
  *               - company
  *               - branch
  *               - supplyerCode
  *               - products
  *             properties:
  *               paymentCondition:
  *                 type: string
  *                 description: Payment condition code
  *                 example: "001"
  *               company:
  *                 type: integer
  *                 description: Company code (COD_EMP)
  *                 example: 1
  *               branch:
  *                 type: integer
  *                 description: Branch code (COD_FIL)
  *                 example: 1
  *               supplyerCode:
  *                 type: integer
  *                 description: Supplier code (COD_FOR)
  *                 example: 25
  *               products:
  *                 type: array
  *                 description: List of products included in the purchase order
  *                 items:
  *                   type: object
  *                   required:
  *                     - productCode
  *                     - orderQuantity
  *                     - unityPrice
  *                   properties:
  *                     productCode:
  *                       type: string
  *                       description: Product code
  *                       example: "0100032"
  *                     orderQuantity:
  *                       type: number
  *                       description: Quantity requested
  *                       example: 10
  *                     unityPrice:
  *                       type: number
  *                       description: Unit price for the product
  *                       example: 59.9
  *     responses:
  *       200:
  *         description: Buying order sent successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success:
  *                   type: boolean
  *                 message:
  *                   type: string
  *                 data:
  *                   type: object
  *       401:
  *         description: Missing or invalid authorization header
  *       500:
  *         description: Internal error or SOAP failure
  */
 async postBuyingOrder(req: Request, res: Response) {
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

   const result = await this.service.sendBuyingOrder(
    username,
    password,
    req.body
   );

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
}
