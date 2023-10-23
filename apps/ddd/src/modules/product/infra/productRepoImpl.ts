import { Product } from "../domain/product";
import { ProductRepository } from "./productRepo";
import { drizzle } from "drizzle-orm/node-postgres";
import { dbPool } from "../../../infra/pool";
import { productTable } from "../../../infra/db/products";

export class ProductRepositoryImpl implements ProductRepository {
  private db = drizzle(dbPool, {
    schema: { products: productTable },
  });

  async save(product: Product): Promise<Product> {
    const newProducts = await this.db
      .insert(productTable)
      .values({
        name: product.props.name.props.value,
        price: product.props.price.props.value,
        stock: product.props.stock.props.value,
      })
      .returning();

    const newProduct = newProducts[0];
    return new Product({
      id: newProduct.id,
      name: product.props.name,
      price: product.props.price,
      stock: product.props.stock,
      createdAt: new Date(newProduct.createdAt),
    });
  }
}
