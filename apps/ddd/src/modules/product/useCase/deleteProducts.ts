import { UseCase } from "@ddd/shared/core";
import { ProductRepository } from "../infra/productRepo";
import { UniqueEntityID } from "@ddd/shared/domain";

export class DeleteProducts implements UseCase<any, any> {
  constructor(private productRepository: ProductRepository) {}
  public async execute(brandId: UniqueEntityID) {
    await this.productRepository.deleteByBrandId(brandId.toValue());
  }
}
