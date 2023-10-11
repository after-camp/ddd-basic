import express from "express";
import {User, UserProps} from "../domain/user";
import {Email} from "../domain/email";

const userRouter = express.Router();

type CreateUserArgs = {
  [K in keyof UserProps]: K extends 'email' ? string : UserProps[K];
};
userRouter.post<any, any, any, CreateUserArgs>('/', (req, res) => {
  const userProps = req.body;

  const user = new User({...userProps, email: new Email({value: userProps.email})});
  res.send(user);
});

export {userRouter};
