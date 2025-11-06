import express from "express";
import serverless from "serverless-http";
import routes from "./routes/index.js";

const app = express();

// Parse JSON bodies before routes
app.use(express.json());
app.use("/api/", routes);

export const handler = serverless(app);
