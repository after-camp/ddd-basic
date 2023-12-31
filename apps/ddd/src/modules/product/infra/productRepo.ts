import { Product } from "../domain/product";

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  getProducts(page: number, limit: number): Promise<Product[]>;
  getProductById(productId: number, withReview: boolean): Promise<Product | undefined>;
  deleteByBrandId(toValue: string | number): Promise<void>;
}
