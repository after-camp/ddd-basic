import { UseCase } from "@ddd/shared/core";
import { ProductRepository } from "../infra/productRepo";
import { GetProductsArgs } from "../route";
import { BrandRepository } from "../../brand/infra/brandRepository";
import { ProductDto } from "../dto/ProductDto";

export class GetProducts implements UseCase<any, any> {
  constructor(
    private productRepository: ProductRepository,
    private brandRepository: BrandRepository,
  ) {}
  public async execute(request: GetProductsArgs): Promise<ProductDto[]> {
    const products = await this.productRepository.getProducts(
      request.page,
      request.limit,
    );
    const brandIds = products.map((p) => p.props.brandId);
    const brands = await this.brandRepository.getBrandsByIds(brandIds);

    const dtos = products.map((p) => {
      return new ProductDto({
        id: p.props.id!,
        name: p.props.name.props.value,
        price: p.props.price.props.value,
        stock: p.props.stock.props.value,
        brandName: brands.find((b) => b.props.id === p.props.brandId)!.props
          .name.props.value!,
      });
    });

    return dtos;
  }
}
