import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface ReviewCommentProps {
  value: string;
}

export const CreateReviewCommentError = {
  InvalidCommentLength: "Invalid comment length",
} as const;

export class ReviewComment extends ValueObject<ReviewCommentProps> {
  private constructor(props: ReviewCommentProps) {
    super(props);
  }

  public static create(
    value: string,
  ): Either.Either<typeof CreateReviewCommentError.InvalidCommentLength, any> {
    if (value.length < 1 || value.length > 500) {
      return Either.left(CreateReviewCommentError.InvalidCommentLength);
    }

    return Either.right(new ReviewComment({ value }));
  }
}
