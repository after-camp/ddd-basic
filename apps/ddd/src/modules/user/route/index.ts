import express from "express";
import { User, UserProps } from "../domain/user";
import { Email } from "../domain/email";
import { Either } from "effect";
import { Username } from "../domain/username";
import { Phone } from "../domain/phone";
import { Password } from "../domain/password";

const userRouter = express.Router();

type CreateUserArgs = {
  [K in keyof UserProps]: string;
};
userRouter.post<any, any, any, CreateUserArgs>("/", async (req, res) => {
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
  Either.match(propsOrError, {
    onLeft: (e) => res.status(400).send(e),
    onRight: ([email, phone, username, password]) => {
      const user = new User({
        email,
        phone,
        username,
        password,
      });
      res.send(user);
    },
  });
});

export { userRouter };
