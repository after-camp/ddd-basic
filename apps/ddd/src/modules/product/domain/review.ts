import { EntityClass } from "@ddd/shared/domain";
import { Rating } from "./rating";
import { ReviewComment } from "./reviewComment";

interface ReviewProps {
  id?: number;
  productId: number;
  userId: number;
  rating: Rating;
  comment: ReviewComment;
}

export class Review extends EntityClass<ReviewProps> {
  constructor(props: ReviewProps) {
    super(props);
  }
}
