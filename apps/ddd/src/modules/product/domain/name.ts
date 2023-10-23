import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

export const ProductNameError = {
  EMPTY: "Product name is empty",
  TOO_LONG: "Product name is too long",
  TOO_SHORT: "Product name is too short",
};

interface ProductNameProps {
  value: string;
}

const MIN_LENGTH = 3;
const MAX_LENGTH = 255;

export class ProductName extends ValueObject<ProductNameProps> {
  static create(name?: string) {
    if (!name) {
      return Either.left(ProductNameError.EMPTY);
    }

    if (name.length < MIN_LENGTH) {
      return Either.left(ProductNameError.TOO_SHORT);
    }

    if (name.length > MAX_LENGTH) {
      return Either.left(ProductNameError.TOO_LONG);
    }

    return Either.right(new ProductName({ value: name }));
  }
}
