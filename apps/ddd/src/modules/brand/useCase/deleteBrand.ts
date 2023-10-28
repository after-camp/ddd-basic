import { UseCase } from "@ddd/shared/core";
import { Either } from "effect";
import { BrandRepository } from "../infra/brandRepository";

export const BrandNotExist = "Brand not exist.";
type DeleteBrandError = typeof BrandNotExist;

export class DeleteBrand implements UseCase<any, any> {
  constructor(private brandRepository: BrandRepository) {}
  public async execute(
    id: number,
  ): Promise<Either.Either<DeleteBrandError, undefined>> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      return Either.left(BrandNotExist);
    }
    brand.delete();
    await this.brandRepository.delete(brand);

    return Either.right(undefined);
  }
}
