import { Product } from "../domain/product";

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  getProducts(page: number, limit: number): Promise<Product[]>;
}
