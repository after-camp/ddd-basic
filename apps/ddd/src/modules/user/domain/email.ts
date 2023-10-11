import {ValueObject} from "@ddd/shared/domain";

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(props: EmailProps) {
    super(props);

    if (!this.isValidEmail(props.value)) {
      throw new Error("Invalid email address");
    }
  }

  private isValidEmail(value: string) {
    const regex = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
    );
    return regex.test(value) != null
  }
}
