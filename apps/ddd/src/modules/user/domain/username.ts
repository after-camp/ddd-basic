import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface UsernameProps {
  value: string;
}

export const UsernameError = {
  UsernameIsRequired: 'Username is required',
  UsernameIsTooShort: 'Username is too short',
  UsernameIsTooLong: 'Username is too long',
} as const;

export class Username extends ValueObject<UsernameProps> {
  static minLength = 2;
  static maxLength = 15;

  private constructor(props: UsernameProps) {
    super(props)
  }

  static create(username?: string) {
    if (username === undefined || username === null) {
      return Either.left(UsernameError.UsernameIsRequired);
    }

    if (this.minLength >= username.length) {
      return Either.left(UsernameError.UsernameIsTooShort);
    }
    if (this.maxLength <= username.length) {
      return Either.left(UsernameError.UsernameIsTooLong);
    }

    return Either.right(new Username({value: username}));
  }
}
