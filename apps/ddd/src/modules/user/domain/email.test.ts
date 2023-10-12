import { faker } from "@faker-js/faker";
import { Email, EmailError } from "./email";
import { Left, Right } from "effect/Either";

describe("Email", () => {
  it("should be a valid email", () => {
    const email = faker.internet.email();

    expect(
      (Email.create(email) as Right<never, Email>).right.props.value,
    ).toEqual(email);
  });

  it("should throw an error if the email is invalid", () => {
    const email = faker.lorem.word();

    expect(
      (Email.create(email) as Left<typeof EmailError.InvalidEmail, never>).left,
    ).toBe("Invalid email address");
  });
});
