import {ValueObject} from "@ddd/shared/domain";
import {left, right} from "effect/Either";

interface EmailProps {
  value: string;
}

export const EmailError = {
  InvalidEmail: "Invalid email address"
} as const;

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  private static isValidEmail(value: string) {
    const regex = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
    );
    return regex.test(value)
  }

  static create(emailAddress: string) {
    if (this.isValidEmail(emailAddress)) {
      return right(new Email({value: emailAddress}));
    } else {
      return left(EmailError.InvalidEmail);
    }
  }
}
