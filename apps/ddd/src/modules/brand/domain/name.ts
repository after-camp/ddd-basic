import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface BrandNameProps {
  value: string;
}

export const BrandNameError = {
  Null: "Brand name is null.",
  TooLong: "Brand name is too long.",
  TooShort: "Brand name is too short.",
} as const;

export class BrandName extends ValueObject<BrandNameProps> {
  private constructor(props) {
    super(props);
  }

  public static create(name?: string) {
    if (!name) return Either.left(BrandNameError.Null);
    if (name.length > 50) return Either.left(BrandNameError.TooLong);
    if (name.length < 3) return Either.left(BrandNameError.TooShort);

    return Either.right(new BrandName({ value: name }));
  }
}
