import express from "express";
import { Either } from "effect";
import { CreateCategory, CreateCategoryError } from "../useCase/createCategory";
import { CategoryRepoImpl } from "../infra/categoryRepoImpl";

const categoryRouter = express.Router();

export type CreateCategoryArgs = {
  name: string;
};
categoryRouter.post<any, any, any, CreateCategoryArgs>(
  "/",
  async (req, res) => {
    const productOrError = await new CreateCategory(
      new CategoryRepoImpl(),
    ).execute(req.body);

    Either.match(productOrError, {
      onLeft: (error) => {
        switch (error) {
          case CreateCategoryError.CategoryNameAlreadyExists:
            res.status(409);
            break;
          default:
            res.status(400);
        }
        res.send(error);
      },
      onRight: (dto) => {
        res.send(dto);
      },
    });
  },
);

export { categoryRouter };
