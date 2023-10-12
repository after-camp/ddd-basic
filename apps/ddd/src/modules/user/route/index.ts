import express from "express";
import { User, UserProps } from "../domain/user";
import { Email } from "../domain/email";
import { Either } from "effect";
import { runSync } from "effect/Effect";

const userRouter = express.Router();

type CreateUserArgs = {
  [K in keyof UserProps]: K extends "email" ? string : UserProps[K];
};
userRouter.post<any, any, any, CreateUserArgs>("/", (req, res) => {
  const userProps = req.body;

  const emailOrError = Email.create(userProps.email);
  Either.match(emailOrError, {
    onLeft: (e) => res.status(400).send(e),
    onRight: (email) => {
      const user = new User({ ...userProps, email });
      res.send(user);
    },
  });
});

export { userRouter };
