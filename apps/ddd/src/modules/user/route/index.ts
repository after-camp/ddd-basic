import express from "express";
import { UserProps } from "../domain/user";
import {
  CreateUser,
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
} from "../useCase/createUser";
import { Either } from "effect";
import DOMPurify from "isomorphic-dompurify";
import { UserRepoImpl } from "../infra/userRepoImpl";
import { Login, LoginError } from "../useCase/login";
import { authService } from "../../../main";

const userRouter = express.Router();

export type CreateUserArgs = {
  [K in keyof UserProps]: string;
};

export type LoginArgs = {
  username: string;
  password: string;
};

userRouter.post<any, any, any, CreateUserArgs>("/", async (req, res) => {
  const phone = DOMPurify.sanitize(req.body.phone);
  const email = DOMPurify.sanitize(req.body.email);
  const username = DOMPurify.sanitize(req.body.username);

  const userOrError = await new CreateUser(new UserRepoImpl()).execute({
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

userRouter.post<any, any, any, LoginArgs>(
  "/login",
  async (req, res) => {
    const { username, password } = req.body;

    const result = await new Login(
      new UserRepoImpl(),
      authService,
    ).execute({
      username,
      password,
    });

    Either.match(result, {
      onLeft: (error) => {
        switch (error) {
          case LoginError.PasswordDoesNotMatchError:
            res.status(401);
            break;
          case LoginError.UsernameNotFoundError:
            res.status(404);
            break;
          default:
            res.status(400);
        }

        res.send(error);
      },
      onRight: (loginDTOResponse) => {
        res.send(loginDTOResponse);
      },
    });
  },
);

userRouter.post('/test', async (req, res) => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    return res.status(403).send({ message: 'No token provided.' });
  }
  const accessToken = authorization.split(' ')[1];
  if (!accessToken) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const decoded = await authService.decodeJWT(accessToken);
  if (decoded === undefined) {
    return res.status(403).send({ message: 'Failed to authenticate token.' });
  }

  const {username} = decoded;
  const tokens = await authService.getTokens(username);

  if (tokens.length === 0) {
    return res.status(403).send({ message: 'Failed to authenticate token.' });
  } else {
    return res.status(200).send({ message: 'Success' });
  }
})

export { userRouter };
