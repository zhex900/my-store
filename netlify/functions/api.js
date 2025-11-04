import express from "express";
import serverless from "serverless-http";
import routes from "./routes/index.js";

const app = express();

app.use("/api/", routes);

//middleware in Express that allows your server to
//parse incoming requests with JSON payloads.
app.use(express.json());

export const handler = serverless(app);
