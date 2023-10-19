import { UseCase } from "@ddd/shared/core";
import { LoginArgs } from "../route";
import { UserRepo } from "../infra/userRepo";
import { Username, UsernameError } from "../domain/username";
import { CreatePasswordError, Password } from "../domain/password";
import { Either } from "effect";
import { AuthService } from "../infra/authService";
import { ValueOf } from "type-fest";
import { LoginDTOResponse } from "../dto/loginDTOResponse";

export const LoginError = {
  UsernameNotFoundError: "Username not found",
  PasswordDoesNotMatchError: "Password does not match",
  ...UsernameError,
  ...CreatePasswordError,
} as const;

export class Login implements UseCase<any, any> {
  constructor(
    private userRepo: UserRepo,
    private authService: AuthService,
  ) {}
  async execute(
    args: LoginArgs,
  ): Promise<Either.Either<ValueOf<typeof LoginError>, LoginDTOResponse>> {
    const usernameOrError = Username.create(args.username);
    const passwordOrError = await Password.create(args.password);

    const errorOrNot = Either.all([usernameOrError, passwordOrError]);
    if (Either.isLeft(errorOrNot)) {
      return Either.left(errorOrNot.left);
    }

    const [username, password] = errorOrNot.right;

    const user = await this.userRepo.getUserByUsername(username);
    if (user === undefined) {
      return Either.left(LoginError.UsernameNotFoundError);
    }

    const passwordValid = await user.props.password.comparePassword(
      password.props.value,
    );
    if (!passwordValid) {
      return Either.left(LoginError.PasswordDoesNotMatchError);
    }

    const accessToken = await this.authService.signJWT({
      userId: user.props.id,
      username: user.props.username.props.value,
      email: user.props.email.props.value,
    });
    const refreshToken = await this.authService.createRefreshToken();

    user.setAccessToken(accessToken, refreshToken);
    await this.authService.saveAuthenticatedUser(user);

    return Either.right(new LoginDTOResponse(accessToken, refreshToken));
  }
}
