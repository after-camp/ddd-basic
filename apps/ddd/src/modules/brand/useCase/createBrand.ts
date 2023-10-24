import { UseCase } from "@ddd/shared/core";
import { BrandName, BrandNameError } from "../domain/name";
import { Either } from "effect";
import { ValueOf } from "type-fest";
import { BrandRepository } from "../infra/brandRepository";
import { BrandCommission, BrandCommissionError } from "../domain/commision";
import {
  BrandRegistrationNumber,
  BrandRegistrationNumberError,
} from "../domain/registrationNumber";
import { Brand } from "../domain/brand";
import { NewBrandDto } from "../dto/newBrandDto";
import { CreateBrandArgs } from "../route";

type CreateProductError =
  | ValueOf<typeof BrandNameError>
  | ValueOf<typeof BrandCommissionError>
  | ValueOf<typeof BrandRegistrationNumberError>;

export class CreateBrand implements UseCase<any, any> {
  constructor(private brandRepository: BrandRepository) {}
  public async execute(
    request: CreateBrandArgs,
  ): Promise<Either.Either<CreateProductError, NewBrandDto>> {
    const brandNameOrError = BrandName.create(request.name);
    const brandCommissionOrError = BrandCommission.create(request.commission);
    const brandRegistrationNumberOrError = BrandRegistrationNumber.create(
      request.registrationNumber,
    );

    const propsOrError = Either.all([
      brandNameOrError,
      brandCommissionOrError,
      brandRegistrationNumberOrError,
    ]);
    if (Either.isLeft(propsOrError)) {
      return Either.left(propsOrError.left);
    }

    const [brandName, brandCommission, brandRegistrationNumber] =
      propsOrError.right;
    const brand = new Brand({
      name: brandName,
      commission: brandCommission,
      registrationNumber: brandRegistrationNumber,
    });

    const newBrand = await this.brandRepository.save(brand);
    return Either.right(new NewBrandDto(newBrand.props.id!));
  }
}
