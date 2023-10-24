import { userRouter } from "./modules/user/route";
import { RedisAuthService } from "./modules/user/infra/redisAuthService";
import express from "express";
import { AuthService } from "./modules/user/infra/authService";
import { productRouter } from "./modules/product/route";
import { brandRouter } from "./modules/brand/route";
import { categoryRouter } from "./modules/category/route";

export const authService: AuthService = new RedisAuthService();

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const v1Router = express.Router();
v1Router.use("/users", userRouter);
v1Router.use("/products", productRouter);
v1Router.use("/brands", brandRouter);
v1Router.use("/categories", categoryRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", v1Router);

app.listen(port, host, () => {
  authService.connect().then(() => {
    console.log("[ ready ] redis client connected");
  });

  console.log(`[ ready ] http://${host}:${port}`);
});

app.on("close", authService.disconnect);
