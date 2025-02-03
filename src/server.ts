import dotenv from "dotenv";
import express, { urlencoded } from "express";
import routes from "./routes";
import { job } from "./cron-server";
dotenv.config();

const execApp = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(urlencoded({ extended: true, limit: "10mb" }));
  app.use(express.json());

  app.use(routes);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    job.start();
  });
};

execApp();
