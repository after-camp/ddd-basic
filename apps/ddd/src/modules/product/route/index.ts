import express from "express";
import { Either } from "effect";
import { CreateProduct } from "../useCase/createProduct";
import { ProductRepositoryImpl } from "../infra/productRepoImpl";
import { BrandRepositoryImpl } from "../../brand/infra/brandRepositoryImpl";
import { CategoryRepoImpl } from "../../category/infra/categoryRepoImpl";
import { GetProducts } from "../useCase/getProducts";

const productRouter = express.Router();

export type CreateProductArgs = {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  brandId: number;
};

export type GetProductsArgs = {
  page: number;
  limit: number;
};

productRouter.post<any, any, any, CreateProductArgs>("/", async (req, res) => {
  const productOrError = await new CreateProduct(
    new ProductRepositoryImpl(),
    new CategoryRepoImpl(),
    new BrandRepositoryImpl(),
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

productRouter.get<any, GetProductsArgs, any, any>("/", async (req, res) => {
  const productDtos = await new GetProducts(
    new ProductRepositoryImpl(),
    new BrandRepositoryImpl(),
  ).execute(req.params);

  res.send(productDtos);
});

export { productRouter };
