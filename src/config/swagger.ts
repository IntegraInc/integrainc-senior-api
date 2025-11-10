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
   {
    url: "https://integrainc-senior-api.vercel.app",
    description: "Production",
   },
   { url: "http://localhost:3000", description: "Local" },
   {
    url: "https://integrainc-senior-api-stage.vercel.app",
    description: "stage",
   },
  ],
  components: {
   securitySchemes: {
    bearerAuth: {
     type: "http",
     scheme: "bearer",
     bearerFormat: "JWT",
     description: "Enter your JWT token here (no need to prefix with Bearer).",
    },
   },
  },
  security: [
   {
    bearerAuth: [],
   },
  ],
 },
 apis: [
  path.resolve(__dirname, "../modules/**/*.ts"), // local dev
  path.resolve(__dirname, "../modules/**/*.js"), // deployed bundle
 ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Express) {
 app.get("/docs", (_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Portal Integra API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout'
      });
    };
  </script>
</body>
</html>`);
 });

 console.log("📘 Swagger UI available at /docs");
}
