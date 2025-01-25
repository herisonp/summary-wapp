import dotenv from "dotenv";
import express, { urlencoded } from "express";
import routes from "./routes";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());

app.use(routes);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
