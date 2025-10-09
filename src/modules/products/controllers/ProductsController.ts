import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

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
