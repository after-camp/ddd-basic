import { User } from "../domain/user";
import { users } from "../../../infra/db/users";
import { Username } from "../domain/username";
import { Either } from "effect";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { Phone } from "../domain/phone";

export class UserMapper {
  static toDomain(raw: typeof users.$inferSelect): User {
    return new User({
      id: raw.id,
      username: (Username.create(raw.username) as Either.Right<never, Username>).right,
      email: (Email.create(raw.email) as Either.Right<never, Email>).right,
      password: Password.unsafeCreate(raw.password),
      phone: (Phone.create(raw.phone) as Either.Right<never, Phone>).right,
    });
  }
}
