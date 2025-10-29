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
 *         description: Page number for pagination
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
 *     responses:
 *       200:
 *         description: Paginated list of products successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 1245
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productCode:
 *                         type: string
 *                         example: "12345"
 *                       barcode:
 *                         type: string
 *                         example: "7891234567890"
 *                       description:
 *                         type: string
 *                         example: "Chocolate Bar 90g"
 *                       origin:
 *                         type: string
 *                         example: "Nacional"
 *                       family:
 *                         type: string
 *                         example: "Alimentos"
 *                       status:
 *                         type: string
 *                         example: "A"
 *                       basePrice:
 *                         type: number
 *                         example: 5.49
 *                       lastCost:
 *                         type: number
 *                         example: 4.20
 *                       avgCost:
 *                         type: number
 *                         example: 4.35
 *                       discountCap:
 *                         type: number
 *                         example: 0.05
 *                       margin:
 *                         type: number
 *                         example: 0.25
 *                       markup:
 *                         type: number
 *                         example: 1.33
 *                       autoTargetMargin:
 *                         type: number
 *                         example: 0.3
 *                       autoTargetMarkup:
 *                         type: number
 *                         example: 1.4
 *                       stock:
 *                         type: number
 *                         example: 123
 *                       minStock:
 *                         type: number
 *                         example: 10
 *                       lastPurchaseDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-09-15"
 *                       sales3Months:
 *                         type: number
 *                         example: 420
 *                       weightedAverage:
 *                         type: number
 *                         example: 4.58
 *       400:
 *         description: Missing pagination parameters (page or limit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You must provide page and limit"
 *       404:
 *         description: Products not found or error fetching from Senior
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No products found."
 *                 details:
 *                   type: string
 *                   example: "Senior API did not return data"
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
  const { page, limit } = req.query;

  if (!page || !limit) {
   return res.status(400).json({ error: "You must provide page and limit" });
  }

  try {
   const result = await this.service.getAnalysis(
    username,
    password,
    0,
    limit,
    page
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
