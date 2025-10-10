import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { setupSwagger } from "../../config/swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
setupSwagger(app);
app.use(routes);

const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || "integrainc-senior-api";

app.listen(port, () => {
 console.log(`🚀 ${appName} is running on port ${port}`);
});
