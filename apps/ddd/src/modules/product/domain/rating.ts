import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";
import * as console from "console";

interface RatingProps {
  value: number;
}

export const CreateRatingError = {
  InvalidRatingValue: "Invalid rating value",
} as const;

export class Rating extends ValueObject<RatingProps> {
  private constructor(props: RatingProps) {
    super(props);
  }

  public static create(
    value: number,
  ): Either.Either<typeof CreateRatingError.InvalidRatingValue, Rating> {
    if (value < 0 || value > 5) {
      return Either.left(CreateRatingError.InvalidRatingValue);
    }

    return Either.right(new Rating({ value }));
  }
}
