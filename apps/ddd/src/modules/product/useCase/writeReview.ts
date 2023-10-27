import { UseCase } from "@ddd/shared/core";
import { CreateReviewArgs } from "../route";
import { Review } from "../domain/review";
import {
  CreateReviewCommentError,
  ReviewComment,
} from "../domain/reviewComment";
import { CreateRatingError, Rating } from "../domain/rating";
import { Either } from "effect";
import { ProductRepository } from "../infra/productRepo";

export const ProductNotFound = "Product not found" as const;
type WriteReviewError =
  | typeof ProductNotFound
  | typeof CreateReviewCommentError.InvalidCommentLength
  | typeof CreateRatingError.InvalidRatingValue;

export class WriteReview implements UseCase<any, any> {
  constructor(private productRepository: ProductRepository) {}
  async execute(
    args: CreateReviewArgs,
  ): Promise<Either.Either<WriteReviewError, void>> {
    const product = await this.productRepository.getProductById(
      args.productId,
      true,
    );
    if (product === undefined) {
      return Either.left(ProductNotFound);
    }

    const reviewCommentOrError = ReviewComment.create(args.comment);
    const ratingOrError = Rating.create(args.rating);

    const propsOrError = Either.all([reviewCommentOrError, ratingOrError]);
    if (Either.isLeft(propsOrError)) {
      return Either.left(propsOrError.left);
    }

    const [reviewComment, rating] = propsOrError.right;
    const review = new Review({
      productId: args.productId,
      userId: args.userId,
      comment: reviewComment,
      rating: rating,
    });

    product.addReview(review);
    await this.productRepository.save(product);

    return Either.right(undefined);
  }
}
