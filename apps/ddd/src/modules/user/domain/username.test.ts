import { Left, Right } from "effect/Either";
import { faker } from "@faker-js/faker";
import { Username, UsernameError } from "./username";

describe("Username", () => {
  it("should be a valid username", () => {
    const username = faker.string.sample(3);

    expect(
      (Username.create(username) as Right<never, Username>).right.props.value
    ).toEqual(username);
  });

  it("should be less than 15 characters", () => {
    const username = faker.string.sample(15)

    expect(
      (
        Username.create(username) as Left<
          typeof UsernameError.UsernameIsTooLong,
          never
        >
      ).left
    ).toEqual(UsernameError.UsernameIsTooLong);
  });

  it("should be more than 2 characters", () => {
    const username = faker.string.sample(2);

    expect(
      (
        Username.create(username) as Left<
          typeof UsernameError.UsernameIsTooShort,
          never
        >
      ).left
    ).toEqual(UsernameError.UsernameIsTooShort);
  });

  it("should not be null", () => {
    expect(
      (
        Username.create(null) as Left<
          typeof UsernameError.UsernameIsRequired,
          never
        >
      ).left
    ).toEqual(UsernameError.UsernameIsRequired);

    expect(
      (
        Username.create(undefined) as Left<
          typeof UsernameError.UsernameIsRequired,
          never
        >
      ).left
    ).toEqual(UsernameError.UsernameIsRequired);
  });
});
