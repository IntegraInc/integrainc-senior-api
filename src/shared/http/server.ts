import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || "integrainc-senior-api";

app.listen(port, () => {
 console.log(`🚀 ${appName} is running on port ${port}`);
});
