import express from 'express';
import { orderRouter } from "./modules/order/route";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
const orderV1Router = express.Router();

orderV1Router.use("/orders", orderRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", orderV1Router);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:3001`);
});
