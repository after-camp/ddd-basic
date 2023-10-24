import { Product } from "../domain/product";

export interface ProductRepository {
  save(product: Product): Promise<Product>;
}