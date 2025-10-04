import { Request, Response } from "express";
import { ReplenishmentService } from "../services/ReplenishmentService";

export class ReplenishmentController {
 private service: ReplenishmentService;

 constructor() {
  this.service = new ReplenishmentService();
 }

 async test(req: Request, res: Response) {
  try {
   const result = await this.service.testIntegration();
   return res.json({ status: "ok", data: result });
  } catch (error: any) {
   console.error("Error in test route:", error);
   return res.status(500).json({ error: "Integration test failed" });
  }
 }
}
