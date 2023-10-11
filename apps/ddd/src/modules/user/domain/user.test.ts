import {faker} from "@faker-js/faker";
import {User} from "./user";

describe('User', () => {
  it('should be able to create a user', () => {
    const user = new User({
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: '010-1234-5678',
      username: faker.internet.userName(),
    });

    expect(user).toBeDefined();
  });

  it('compares two users', () => {
    const user = new User({
      id: '1',
      email: "test@email.com",
      password: faker.internet.password(),
      phone: '010-1234-5678',
      username: faker.internet.userName(),
    });
    const user2 = new User({
      id: '1',
      email: "test2@gmail.com",
      password: faker.internet.password(),
      phone: '010-1234-5678',
      username: faker.internet.userName(),
    })

    expect(user.equals(user2)).toBe(true);
  })
});
