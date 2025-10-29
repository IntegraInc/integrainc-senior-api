import { Request, Response } from "express";
import { FilterService } from "../services/FilterService";

/**
 * @openapi
 * /utils/filters:
 *   get:
 *     summary: Get the filters from Replenishment module
 *     tags:
 *       - Filter
 *     responses:
 *       201:
 *         description: Filters fetched successfully
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
 *                   example: Filters fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     fornecedor:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: string
 *                             example: "001"
 *                           nome:
 *                             type: string
 *                             example: "Fornecedor ABC"
 *                     condicaoPagamento:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: string
 *                             example: "30"
 *                           descricao:
 *                             type: string
 *                             example: "30 dias"
 *                     formaPagamento:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: string
 *                             example: "BOL"
 *                           descricao:
 *                             type: string
 *                             example: "Boleto Bancário"
 *                     familia:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: string
 *                             example: "F01"
 *                           descricao:
 *                             type: string
 *                             example: "Família de Produtos"
 */

export class FilterController {
 private service: FilterService;

 constructor() {
  this.service = new FilterService();
 }

 async getFilters(req: Request, res: Response) {
  try {
   const { username, password } = (req as any).user;
   const result = await this.service.getFilters(username, password);

   if (!result.success) {
    return res.status(404).json(result);
   }
   return res.status(200).json(result);
  } catch (error: any) {
   console.error("Request error :", error.message);
   return res
    .status(500)
    .json({ success: false, error: "Internal error", details: error.message });
  }
 }
 /**
  * @openapi
  * /utils/filters/table-price:
  *   get:
  *     summary: Get the filters from table price module
  *     tags:
  *       - Filter
  *     responses:
  *       201:
  *         description: Filters fetched successfully
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
  *                   example: Filters fetched successfully
  *                 data:
  *                   type: object
  *                   properties:
  *                     tablePrice:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           code:
  *                             type: string
  *                             example: "TPM"
  *
  */

 async getFiltersTablePrice(req: Request, res: Response) {
  try {
   const { username, password } = (req as any).user;
   const result = await this.service.getFiltersTablePrice(username, password);

   if (!result.success) {
    return res.status(404).json(result);
   }
   return res.status(200).json(result);
  } catch (error: any) {
   console.error("Request error :", error.message);
   return res
    .status(500)
    .json({ success: false, error: "Internal error", details: error.message });
  }
 }
 async refreshRedis(req: Request, res: Response) {
  try {
   const response = await this.service.refreshRedis();
   if (!response.success) {
    return res.status(500).json(response);
   }
   return res.status(200).json({
    success: true,
    message: "Filters cache cleared successfully.",
   });
  } catch (error: any) {
   console.error("Request error :", error.message);
   return res
    .status(500)
    .json({ success: false, error: "Internal error", details: error.message });
  }
 }
}
