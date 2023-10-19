export class LoginDTOResponse {
  constructor(
    private readonly accessToken: string,
    private readonly refreshToken: string,
  ) {}
}
