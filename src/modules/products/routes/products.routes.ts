import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController";

const productsRoutes = Router();
const controller = new ProductsController();

// Test endpoint
productsRoutes.get("/all", (req, res) => controller.getProducts(req, res));
productsRoutes.post("/buying-order", (req, res) =>
 controller.postBuyingOrder(req, res)
);

export default productsRoutes;
