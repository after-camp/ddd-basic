import { User } from "../domain/user";
import { Username } from "../domain/username";
import { Email } from "../domain/email";

export interface UserRepo {
  create(user: User): Promise<User>;
  existsUsername(username: Username): Promise<boolean>;
  existsEmail(email: Email): Promise<boolean>;
  getUserByUsername(value): Promise<User>
}
