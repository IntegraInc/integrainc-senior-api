import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const swaggerOptions = {
 definition: {
  openapi: "3.0.0",
  info: {
   title: "Portal Plenitude API",
   version: "1.0.0",
   description: "API documentation for Portal Plenitude backend",
  },
  servers: [
   { url: "http://localhost:3000", description: "Local Server" },
   {
    url: "https://integrainc-senior-api.vercel.app",
    description: "Production",
   },
  ],
 },
 apis: [path.resolve(__dirname, "../modules/**/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Express) {
 // Serve the static assets properly (important for Vercel)
 app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
   explorer: true,
   customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  })
 );

 console.log("📘 Swagger docs available at /docs");
}
