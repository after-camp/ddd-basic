import { UseCase } from "@ddd/shared/core";
import { Email, EmailError } from "../domain/email";
import { Phone, PhoneError } from "../domain/phone";
import { Username, UsernameError } from "../domain/username";
import { CreatePasswordError, Password } from "../domain/password";
import { Either } from "effect";
import { User } from "../domain/user";
import { CreateUserArgs } from "../route";
import { ValueOf } from "type-fest";
import { UserRepo } from "../infra/UserRepo";
import { CreateUserDto } from "../dto/CreateUserDto";

export const EmailAlreadyExistsError = "Email already exists" as const;
export const UsernameAlreadyExistsError = "Username already exists" as const;
type CreateUserError =
  | ValueOf<typeof UsernameError>
  | ValueOf<typeof EmailError>
  | ValueOf<typeof PhoneError>
  | ValueOf<typeof CreatePasswordError>
  | typeof EmailAlreadyExistsError
  | typeof UsernameAlreadyExistsError;

type Result = Promise<Either.Either<CreateUserError, CreateUserDto>>;
export class CreateUser implements UseCase<CreateUserArgs, Result> {
  constructor(private userRepo: UserRepo) {}
  async execute(userProps): Result {
    const emailOrError = Email.create(userProps.email);
    const phoneOrError = Phone.create(userProps.phone);
    const usernameOrError = Username.create(userProps.username);
    const passwordOrError = await Password.create(userProps.password);

    const propsOrError = Either.all([
      emailOrError,
      phoneOrError,
      usernameOrError,
      passwordOrError,
    ]);
    if (Either.isLeft(propsOrError)) {
      return Either.left(propsOrError.left);
    }

    const [email, phone, username, password] = propsOrError.right;
    const emailExists = await this.userRepo.existsEmail(email);
    if (emailExists) {
      return Either.left(EmailAlreadyExistsError);
    }
    const usernameExists = await this.userRepo.existsUsername(username);
    if (usernameExists) {
      return Either.left(UsernameAlreadyExistsError);
    }

    const user = new User({
      email,
      phone,
      username,
      password,
    });

    const newUser = await this.userRepo.create(user);
    return Either.right(new CreateUserDto(newUser.props.id));
  }
}
