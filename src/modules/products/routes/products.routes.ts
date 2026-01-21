import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController";

const productsRoutes = Router();
const controller = new ProductsController();

// Test endpoint
productsRoutes.get("/all", (req, res) => controller.getProducts(req, res));
productsRoutes.post("/change-price", (req, res) =>
 controller.changePrice(req, res)
);
productsRoutes.post("/import-price", (req, res) =>
 controller.importPrice(req, res)
);
productsRoutes.get("/export-price", (req, res) =>
 controller.exportPrice(req, res)
);

export default productsRoutes;
