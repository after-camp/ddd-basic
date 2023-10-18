import { UseCase } from "@ddd/shared/core";
import { drizzle } from "drizzle-orm/node-postgres";
import { users as usersTable } from "../../../infra/db/users";
import { Email, EmailError } from "../domain/email";
import { Phone, PhoneError } from "../domain/phone";
import { Username, UsernameError } from "../domain/username";
import { CreatePasswordError, Password } from "../domain/password";
import { Either } from "effect";
import { User } from "../domain/user";
import { Client } from "pg";
import { CreateUserArgs } from "../route";
import { ValueOf } from "type-fest";

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "infstyle",
});

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
  async execute(userProps): Result {
    await client.connect();
    const db = drizzle(client, {
      schema: { users: usersTable },
    });

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
    const emailExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email.props.value),
    });
    if (emailExists) {
      return Either.left(EmailAlreadyExistsError);
    }
    const usernameExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username.props.value),
    });
    if (usernameExists) {
      return Either.left(UsernameAlreadyExistsError);
    }

    const user = new User({
      email,
      phone,
      username,
      password,
    });

    const newUser = await db
      .insert(usersTable)
      .values({
        email: user.props.email.props.value,
        phone: user.props.phone.props.value,
        username: user.props.username.props.value,
        password: user.props.password.props.value,
      })
      .returning();

    return Either.right(new CreateUserDto(newUser[0].id));
  }
}
