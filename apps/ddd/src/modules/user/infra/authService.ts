import { User, UserProps } from "../domain/user";

export interface AuthService {
  signJWT(userInfo: {
    username: string;
    userId: UserProps["id"];
    email: string;
  }): Promise<string>;
  createRefreshToken(): Promise<string>;
  saveAuthenticatedUser(user: User): Promise<void>;
}
