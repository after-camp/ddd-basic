import express from "express";
import { Either } from "effect";
import { CreateProduct } from "../useCase/createProduct";
import { ProductRepositoryImpl } from "../infra/productRepoImpl";
import { BrandRepositoryImpl } from "../../brand/infra/brandRepositoryImpl";
import { CategoryRepoImpl } from "../../category/infra/categoryRepoImpl";
import { GetProducts } from "../useCase/getProducts";
import { ProductNotFound, WriteReview } from "../useCase/writeReview";

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

export type CreateReviewArgs = {
  productId: number;
  userId: number;
  rating: number;
  comment: string;
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

productRouter.post<any, any, any, CreateReviewArgs>(
  "/review",
  async (req, res) => {
    const newReviewOrError = await new WriteReview(
      new ProductRepositoryImpl(),
    ).execute(req.body);

    Either.match(newReviewOrError, {
      onLeft: (error) => {
        switch (error) {
          case ProductNotFound:
            res.status(404);
            break;
          default:
            res.status(400);
        }

        res.send();
      },
      onRight: () => {
        res.status(201).send();
      },
    });
  },
);

export { productRouter };
