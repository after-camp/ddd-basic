import {faker} from "@faker-js/faker";
import {Email} from "./email";

describe('Email', () => {
  it('should be a valid email', () => {
    const email = faker.internet.email();

    expect(new Email({value: email})).toBeDefined();
  })
});
