import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

export const ProductStockError = {
  NEGATIVE: "Product stock must be positive",
  Null: "Product stock must be defined",
} as const;

interface ProductStockProps {
  value: number;
}

export class ProductStock extends ValueObject<ProductStockProps> {
  static create(stock: number) {
    if (stock === undefined) {
      return Either.left(ProductStockError.Null);
    }

    if (stock < 0) {
      return Either.left(ProductStockError.NEGATIVE);
    }
    return Either.right(new ProductStock({ value: stock }));
  }
}
