import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get paginated products list
 *     description: Returns a paginated list of products from Senior, mapped into frontend-friendly fields.
 *     tags:
 *       - Products
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

export class ProductsController {
 private service: ProductService;

 constructor() {
  this.service = new ProductService();
 }

 async getProducts(req: Request, res: Response) {
  const { page, limit } = req.query;

  if (!page || !limit) {
   return res.status(400).json({ error: "You must provide page and limit" });
  }

  try {
   const result = await this.service.getProducts(limit, page);
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
}
