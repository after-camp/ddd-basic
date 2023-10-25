import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface BrandCommissionProps {
  value: number;
}

export const BrandCommissionError = {
  Null: "Brand commission is null.",
  Negative: "Brand commission is negative.",
  TooHigh: "Brand commission is too high.",
};

export class BrandCommission extends ValueObject<BrandCommissionProps> {
  private constructor(props: BrandCommissionProps) {
    super(props);
  }

  public static create(value?: number) {
    if (!value) return Either.left(BrandCommissionError.Null);
    if (value < 0) return Either.left(BrandCommissionError.Negative);
    if (value > 100) return Either.left(BrandCommissionError.TooHigh);

    return Either.right(new BrandCommission({ value: value / 100 }));
  }

  static unsafeCreate(commission: number) {
    return new BrandCommission({ value: commission });
  }
}
