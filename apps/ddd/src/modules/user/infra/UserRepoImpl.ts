import { UserRepo } from "./UserRepo";
import { users as usersTable } from "../../../infra/db/users";
import { drizzle } from "drizzle-orm/node-postgres";
import { User } from "../domain/user";
import { Email } from "../domain/email";
import { Username } from "../domain/username";
import { dbPool } from "../../../infra/pool";

export class UserRepoImpl implements UserRepo {
  private db = drizzle(dbPool, {
    schema: { users: usersTable },
  });

  async create(user: User): Promise<User> {
    const newUser = await this.db
      .insert(usersTable)
      .values({
        email: user.props.email.props.value,
        phone: user.props.phone.props.value,
        username: user.props.username.props.value,
        password: user.props.password.props.value,
      })
      .returning();

    return new User({
      id: newUser[0].id,
      email: user.props.email,
      phone: user.props.phone,
      username: user.props.username,
      password: user.props.password,
    });
  }

  async existsEmail(email: Email): Promise<boolean> {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email.props.value),
    });

    return !!user === true;
  }

  async existsUsername(username: Username): Promise<boolean> {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username.props.value),
    });

    return !!user === true;
  }
}
