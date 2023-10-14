import { faker } from "@faker-js/faker";
import { User } from "./user";
import { Email } from "./email";
import { Right } from "effect/Either";
import { Phone } from "./phone";
import { Username } from "./username";
import { Password } from "./password";

describe("User", () => {
  let email: Email;
  let phone: Phone;
  let username: Username;
  let password: Password;

  beforeAll(async () => {
    email = (Email.create(faker.internet.email()) as Right<never, Email>).right;
    phone = (Phone.create("010-1234-5678") as Right<never, any>).right;
    username = (Username.create(faker.internet.userName()) as Right<never, any>)
      .right;
    password = (
      (await Password.create(faker.internet.password())) as Right<never, any>
    ).right;
  });

  it("should be able to create a user", () => {
    const user = new User({
      email,
      password,
      phone,
      username,
    });

    expect(user).toBeDefined();
  });

  it("compares two users", () => {
    const user = new User({
      id: "1",
      email,
      password,
      phone,
      username,
    });
    const user2 = new User({
      id: "1",
      email,
      password,
      phone,
      username,
    });

    expect(user.equals(user2)).toBe(true);
  });
});
