import { Phone, PhoneError } from "./phone";
import { Left, Right } from "effect/Either";

describe("Phone", () => {
  it("should be a valid phone number", () => {
    const phone = "010-4567-8900";
    expect(
      (Phone.create(phone) as Right<never, any>).right.props.value
    ).toEqual(phone);
  });

  it("should return an error if the phone number is invalid", () => {
    const invalidPhone = "010-4567-890";
    expect(
      (
        Phone.create(invalidPhone) as Left<
          typeof PhoneError.InvalidPhone,
          never
        >
      ).left
    ).toEqual(PhoneError.InvalidPhone);
  });
});
