import express from "express";
import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import appRouter from "./routes/app.routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.use("/api/v1", appRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log("Database connection failed:", error));
