import { User } from "../domain/user";
import { AuthService } from "./authService";
import randtoken from "rand-token";
import * as jwt from "jsonwebtoken";
import { createClient, RedisClientType } from "redis";

export interface JWTClaims {
  userId: number;
  username: string;
  email: string;
}

const SECRET = "secret";

export class RedisAuthService implements AuthService {
  private client: RedisClientType;

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async getTokens(username: string) {
    const keyValues = await this.client.keys(`*.${username}`);
    return Promise.all(keyValues.map((kv) => this.client.get(kv)));
  }

  decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve) => {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
          console.error(err);
          return resolve(undefined);
        }
        return resolve(decoded);
      });
    });
  }
  constructor() {
    this.client = createClient();
  }
  createRefreshToken(): Promise<string> {
    return Promise.resolve(randtoken.uid(256));
  }

  async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.props.username.props.value,
        user.props.refreshToken,
        user.props.accessToken,
      );
    }
  }

  signJWT(claim: JWTClaims): Promise<string> {
    const claims = {
      email: claim.email,
      username: claim.username,
      userId: claim.userId,
    };

    // TODO: Add the secret to the config
    return jwt.sign(claims, SECRET, {
      expiresIn: "1h",
    });
  }

  private async addToken(
    username: string,
    refreshToken: string,
    token: string,
  ): Promise<void> {
    await this.client.setEx(
      this.constructKey(username, refreshToken),
      7200,
      token,
    );
  }

  private async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  private constructKey(username: string, refreshToken: string): string {
    return `refresh-${refreshToken}.${username}`;
  }
}
