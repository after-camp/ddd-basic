import express from "express";
import { User, UserProps } from "../domain/user";
import { Email } from "../domain/email";
import { Either } from "effect";
import { Username } from "../domain/username";
import { Phone } from "../domain/phone";
import { Password } from "../domain/password";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users as usersTable } from "../../../infra/db/users";

const userRouter = express.Router();
const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "infstyle",
});

type CreateUserArgs = {
  [K in keyof UserProps]: string;
};
userRouter.post<any, any, any, CreateUserArgs>("/", async (req, res) => {
  await client.connect();
  const db = drizzle(client, {
    schema: { users: usersTable },
  });

  const userProps = req.body;

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
    res.status(400).send(propsOrError.left);
    return;
  }

  const [email, phone, username, password] = propsOrError.right;
  const emailExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email.props.value),
  });
  if (emailExists) {
    res.status(409).send("Email already exists");
    return;
  }
  const usernameExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username.props.value),
  });
  if (usernameExists) {
    res.status(409).send("Username already exists");
    return;
  }
  const user = new User({
    email,
    phone,
    username,
    password,
  });


  await db.insert(usersTable).values({
    email: user.props.email.props.value,
    phone: user.props.phone.props.value,
    username: user.props.username.props.value,
    password: user.props.password.props.value,
  })

  res.send(user);
});

export { userRouter };
