import { Product } from "../domain/product";
import { ProductRepository } from "./productRepo";
import { drizzle } from "drizzle-orm/node-postgres";
import { dbPool } from "../../../infra/pool";
import { productTable } from "../../../infra/db/products";
import { ProductName } from "../domain/name";
import { ProductStock } from "../domain/stock";
import { ProductPrice } from "../domain/price";

export class ProductRepositoryImpl implements ProductRepository {
  private db = drizzle(dbPool, {
    schema: { products: productTable },
  });

  async save(product: Product): Promise<Product> {
    const newProducts = await this.db
      .insert(productTable)
      .values({
        categoryId: product.props.categoryId,
        brandId: product.props.brandId,
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
      brandId: product.props.brandId,
      categoryId: product.props.categoryId,
      createdAt: new Date(newProduct.createdAt),
    });
  }

  async getProducts(page: number, limit: number): Promise<Product[]> {
    const ps = await this.db.query.products.findMany({
      offset: (page - 1) * limit,
      limit,
    });

    return ps.map(
      (p) =>
        new Product({
          id: p.id,
          name: ProductName.unsafeCreate(p.name),
          price: ProductPrice.unsafeCreate(p.price),
          stock: ProductStock.unsafeCreate(p.stock),
          brandId: p.brandId,
          categoryId: p.categoryId,
          createdAt: new Date(p.createdAt),
        }),
    );
  }
}
