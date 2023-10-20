import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";
import * as bcrypt from "bcrypt";

interface PasswordProps {
  value: string;
  hashed?: boolean;
}

export const CreatePasswordError = {
  EmptyPassword: "Password can't be empty",
  TooShortPassword: "Password doesn't meet criteria [6 chars min]",
  TooLongPassword: "Password doesn't meet criteria [20 chars max]",
} as const;

export class Password extends ValueObject<PasswordProps> {
  static MIN_LENGTH = 6;
  static MAX_LENGTH = 20;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PasswordProps) {
    super(props);
  }

  public static async create(
    password?: string,
    hashed?: boolean,
  ): Promise<
    Either.Either<
      (typeof CreatePasswordError)[keyof typeof CreatePasswordError],
      Password
    >
  > {
    if (password === undefined || password === null) {
      return Either.left(CreatePasswordError.EmptyPassword);
    }

    if (this.MIN_LENGTH > password.length) {
      return Either.left(CreatePasswordError.TooShortPassword);
    }

    if (this.MAX_LENGTH < password.length) {
      return Either.left(CreatePasswordError.TooLongPassword);
    }

    if (hashed) {
      return Either.right(
        new Password({
          value: await this.hashPassword(password),
          hashed: true,
        }),
      );
    }

    return Either.right(
      new Password({
        value: password,
        hashed: false,
      }),
    );
  }

  public static unsafeCreate(password: string): Password {
    return new Password({ value: password, hashed: false });
  }

  private static hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    return bcrypt.hash(password, saltRound);
  }

  async comparePassword(value: string): Promise<boolean> {
    return bcrypt.compare(value, this.props.value);
  }
}
