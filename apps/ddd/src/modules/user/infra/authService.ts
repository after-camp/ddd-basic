import { User, UserProps } from "../domain/user";
import { JWTClaims } from "./redisAuthService";

export interface AuthService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signJWT(userInfo: {
    username: string;
    userId: UserProps["id"];
    email: string;
  }): Promise<string>;
  createRefreshToken(): Promise<string>;
  saveAuthenticatedUser(user: User): Promise<void>;
  decodeJWT(token: string): Promise<JWTClaims | undefined>;
  getTokens(username: string): Promise<string[]>;
}
