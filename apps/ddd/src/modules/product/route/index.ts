import express from "express";
import { Either } from "effect";
import { CreateProduct } from "../useCase/createProduct";
import { ProductRepositoryImpl } from "../infra/productRepoImpl";

const productRouter = express.Router();

export type CreateProductArgs = {
  name: string;
  price: number;
  stock: number;
};
productRouter.post<any, any, any, CreateProductArgs>("/", async (req, res) => {
  const productOrError = await new CreateProduct(
    new ProductRepositoryImpl(),
  ).execute(req.body);

  Either.match(productOrError, {
    onLeft: (error) => {
      res.status(400);
      res.send(error);
    },
    onRight: (dto) => {
      res.send(dto);
    },
  });
});

export { productRouter };
