import express from "express";
import { User, UserProps } from "../domain/user";
import { Email } from "../domain/email";
import { Either } from "effect";
import { Username } from "../domain/username";
import { Phone } from "../domain/phone";

const userRouter = express.Router();

type CreateUserArgs = {
  [K in keyof UserProps]: string;
};
userRouter.post<any, any, any, CreateUserArgs>("/", (req, res) => {
  const userProps = req.body;

  const emailOrError = Email.create(userProps.email);
  const phoneOrError = Phone.create(userProps.phone);
  const usernameOrError = Username.create(userProps.username);

  const propsOrError = Either.all([
    emailOrError,
    phoneOrError,
    usernameOrError,
  ]);
  Either.match(propsOrError, {
    onLeft: (e) => res.status(400).send(e),
    onRight: ([email, phone, username]) => {
      const user = new User({
        email,
        phone,
        username,
        password: userProps.password,
      });
      res.send(user);
    },
  });
});

export { userRouter };
