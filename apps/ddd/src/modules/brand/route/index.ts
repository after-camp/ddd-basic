import express from "express";
import { Either } from "effect";
import { BrandNameAlreadyExists, CreateBrand } from "../useCase/createBrand";
import { BrandRepositoryImpl } from "../infra/brandRepositoryImpl";
import { DeleteBrand } from "../useCase/deleteBrand";

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
      switch (error) {
        case BrandNameAlreadyExists:
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
});

brandRouter.delete<any, { id: number }, any, any>("/:id", async (req, res) => {
  const brandOrError = await new DeleteBrand(new BrandRepositoryImpl()).execute(
    req.params.id,
  );

  Either.match(brandOrError, {
    onLeft: (error) => {
      res.status(404).send(error);
    },
    onRight: () => {
      res.status(204).send();
    },
  });
});

export { brandRouter };
