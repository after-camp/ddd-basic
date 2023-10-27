import { Entity } from "@ddd/shared/domain";
import { ProductName } from "./name";
import { ProductPrice } from "./price";
import { ProductStock } from "./stock";
import { AggregateRoot } from "../../../../../../shared/src/lib/domain/AggregateRoot";
import { Review } from "./review";

interface ProductProps {
  id?: number;
  name: ProductName;
  price: ProductPrice;
  stock: ProductStock;
  reviews: Review[];
  categoryId: number;
  brandId: number;
  createdAt?: Date;
  isTopRated?: boolean;
}
@Entity
export class Product extends AggregateRoot<ProductProps> {
  constructor(props: ProductProps) {
    super(props);
  }

  addReview(review: Review) {
    this.props.reviews.push(review);
    if (!this.props.isTopRated) {
      this.props.isTopRated = this.isTopRated();
    }
  }

  private isTopRated(): boolean {
    return (
      this.props.reviews.filter(
        (review) => review.props.rating.props.value >= 4,
      ).length >= 3
    );
  }
}
