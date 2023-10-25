import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

export const ProductPriceError = {
  NotPositive: "Product price must be positive",
  Null: "Product price must be defined",
} as const;

interface ProductPriceProps {
  value: number;
}

export class ProductPrice extends ValueObject<ProductPriceProps> {
  static create(price?: number) {
    if (price === undefined) {
      return Either.left(ProductPriceError.Null);
    }

    if (price <= 0) {
      return Either.left(ProductPriceError.NotPositive);
    }

    return Either.right(new ProductPrice({ value: price }));
  }

  static unsafeCreate(price) {
    return new ProductPrice({ value: price });
  }
}
