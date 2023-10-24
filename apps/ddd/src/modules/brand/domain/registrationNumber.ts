import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface BrandRegistrationNumberProps {
  value: string;
}

export const BrandRegistrationNumberError = {
  Null: "Brand registration number cannot be null.",
} as const;

export class BrandRegistrationNumber extends ValueObject<BrandRegistrationNumberProps> {
  private constructor(props) {
    super(props);
  }

  public static create(registrationNumber?: string) {
    if (!registrationNumber) {
      return Either.left(BrandRegistrationNumberError.Null);
    }

    return Either.right(
      new BrandRegistrationNumber({ value: registrationNumber }),
    );
  }
}
