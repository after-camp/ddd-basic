import express from "express";
import { UserProps } from "../domain/user";
import {
  CreateUser,
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
} from "../useCase/createUser";
import { Either } from "effect";
import DOMPurify from "dompurify";

const userRouter = express.Router();

export type CreateUserArgs = {
  [K in keyof UserProps]: string;
};

userRouter.post<any, any, any, CreateUserArgs>("/", async (req, res) => {
  const phone = DOMPurify.sanitize(req.body.phone);
  const email = DOMPurify.sanitize(req.body.email);
  const username = DOMPurify.sanitize(req.body.username);

  const userOrError = await new CreateUser().execute({
    phone,
    email,
    username,
    password: req.body.password,
  });

  Either.match(userOrError, {
    onLeft: (error) => {
      switch (error) {
        case EmailAlreadyExistsError:
        case UsernameAlreadyExistsError:
          res.status(409);
          break;
        default:
          res.status(400);
      }

      res.send(error);
    },
    onRight: (userId) => {
      res.send(userId);
    },
  });
});

export { userRouter };
