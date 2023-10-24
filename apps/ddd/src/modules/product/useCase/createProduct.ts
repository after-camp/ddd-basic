import { UseCase } from "@ddd/shared/core";
import { ProductName, ProductNameError } from "../domain/name";
import { ProductPrice, ProductPriceError } from "../domain/price";
import { Product } from "../domain/product";
import { ProductStock, ProductStockError } from "../domain/stock";
import { Either } from "effect";
import { ProductRepository } from "../infra/productRepo";
import { NewProductDto } from "../dto/newProductDto";
import { CreateProductArgs } from "../route";
import { ValueOf } from "type-fest";

type CreateProductError =
  | ValueOf<typeof ProductNameError>
  | ValueOf<typeof ProductPriceError>
  | ValueOf<typeof ProductStockError>;

export class CreateProduct implements UseCase<any, any> {
  constructor(private productRepository: ProductRepository) {}
  public async execute(
    request: CreateProductArgs,
  ): Promise<Either.Either<CreateProductError, NewProductDto>> {
    const productNameOrError = ProductName.create(request.name);
    const productPriceOrError = ProductPrice.create(request.price);
    const productStockOrError = ProductStock.create(request.stock);

    const propsOrError = Either.all([
      productNameOrError,
      productPriceOrError,
      productStockOrError,
    ]);
    if (Either.isLeft(propsOrError)) {
      return Either.left(propsOrError.left);
    }

    const [productName, productPrice, productStock] = propsOrError.right;

    const product = new Product({
      name: productName,
      price: productPrice,
      stock: productStock,
    });

    const newProduct = await this.productRepository.save(product);
    return Either.right(new NewProductDto(newProduct.props.id!));
  }
}