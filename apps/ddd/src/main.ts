import { userRouter } from "./modules/user/route";
import { RedisAuthService } from "./modules/user/infra/redisAuthService";
import express from "express";
import { AuthService } from "./modules/user/infra/authService";
import { productRouter } from "./modules/product/route";
import { brandRouter } from "./modules/brand/route";
import { categoryRouter } from "./modules/category/route";
import { DomainEvents } from "../../../shared/src/lib/domain/events/DomainEvents";
import { BrandDeleted } from "./modules/brand/domain/event/brandDeleted";
import { ProductEventHandler } from "./modules/product/infra/eventListener";
import { orderRouter } from "./modules/order/route";

export const authService: AuthService = new RedisAuthService();

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const orderApp = express();

const v1Router = express.Router();
const orderV1Router = express.Router();

v1Router.use("/users", userRouter);
v1Router.use("/products", productRouter);
v1Router.use("/brands", brandRouter);
v1Router.use("/categories", categoryRouter);

orderV1Router.use("/orders", orderRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

orderApp.use(express.json());
orderApp.use(express.urlencoded({ extended: false }));

app.use("/api/v1", v1Router);
orderApp.use("/api/v1", orderV1Router);

app.listen(port, host, () => {
  authService.connect().then(() => {
    console.log("[ ready ] redis client connected");
  });

  console.log(`[ ready ] http://${host}:${port}`);
});

orderApp.listen(3001, host, () => {
  console.log(`[ ready ] http://${host}:3001`);
})

app.on("close", authService.disconnect);

DomainEvents.register((event) => ProductEventHandler.handle(event), BrandDeleted.name);
