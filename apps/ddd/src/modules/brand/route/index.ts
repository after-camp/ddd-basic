import express from "express";
import { Either } from "effect";
import { CreateBrand } from "../useCase/createBrand";
import { BrandRepositoryImpl } from "../infra/brandRepositoryImpl";

const brandRouter = express.Router();

export interface CreateBrandArgs {
  name: string;
  commission: number;
  registrationNumber: string;
}

brandRouter.post<any, any, any, CreateBrandArgs>("/", async (req, res) => {
  const brandOrError = await new CreateBrand(new BrandRepositoryImpl()).execute(
    req.body,
  );

  Either.match(brandOrError, {
    onLeft: (error) => {
      res.status(400);
      res.send(error);
    },
    onRight: (dto) => {
      res.send(dto);
    },
  });
});

export { brandRouter };
