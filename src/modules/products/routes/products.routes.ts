import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController";

const productsRoutes = Router();
const controller = new ProductsController();

// Test endpoint
productsRoutes.get("/all", (req, res) => controller.getProducts(req, res));
productsRoutes.post("/change-price", (req, res) =>
 controller.changePrice(req, res)
);

export default productsRoutes;
