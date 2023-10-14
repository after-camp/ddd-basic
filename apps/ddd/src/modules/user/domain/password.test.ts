import { faker } from "@faker-js/faker";
import { Left, Right } from "effect/Either";
import { CreatePasswordError, Password } from "./password";
import * as bcrypt from "bcrypt";

describe("Password", () => {
  it("should be a valid password", async () => {
    const password = faker.internet.password();

    const passwordOrError = await Password.create(password);
    expect(
      bcrypt.compare(
        password,
        (passwordOrError as Right<never, Password>).right.props.value,
      ),
    ).toBeTruthy();
  });

  it("should throw an error if the password is undefined", async () => {
    const passwordOrError = await Password.create(undefined);

    expect((passwordOrError as Left<any, never>).left).toBe(
      CreatePasswordError.EmptyPassword,
    );
  });

  it("should throw an error if the password is null", async () => {
    const passwordOrError = await Password.create(null);

    expect((passwordOrError as Left<any, never>).left).toBe(
      CreatePasswordError.EmptyPassword,
    );
  });

  it("should throw an error if the password is less than 6", async () => {
    const password = faker.string.sample(5);
    const errorOrError = await Password.create(password);
    expect((errorOrError as Left<any, never>).left).toBe(
      CreatePasswordError.TooShortPassword,
    );
  });

  it("should throw an error if the password is more than 20", async () => {
    const password = faker.string.sample(21);
    const errorOrError = await Password.create(password);

    expect((errorOrError as Left<any, never>).left).toBe(
      CreatePasswordError.TooLongPassword,
    );
  });
});
