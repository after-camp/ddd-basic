import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface PhoneProps {
  value: string;
}

export const PhoneError = {
  InvalidPhone: "Invalid phone number",
} as const;

export class Phone extends ValueObject<PhoneProps> {
  private constructor(props: PhoneProps) {
    super(props);
  }

  static create(phone?: string) {
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return Either.left(PhoneError.InvalidPhone);
    }

    return Either.right(new Phone({ value: phone }));
  }
}
