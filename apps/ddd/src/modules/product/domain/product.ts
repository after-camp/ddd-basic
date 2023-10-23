import { Entity, EntityClass } from "@ddd/shared/domain";
import { ProductName } from "./name";
import { ProductPrice } from "./price";
import { ProductStock } from "./stock";

interface ProductProps {
  id?: number;
  name: ProductName;
  price: ProductPrice;
  stock: ProductStock;
  createdAt?: Date;
}
@Entity
export class Product extends EntityClass<ProductProps> {
  constructor(props: ProductProps) {
    super(props);
  }
}
