import { Product } from "../domain/product";
import { ProductRepository } from "./productRepo";
import { drizzle } from "drizzle-orm/node-postgres";
import { dbPool } from "../../../infra/pool";
import * as productSchema from "../../../infra/db/products";
import { productTable } from "../../../infra/db/products";
import * as reviewSchema from "../../../infra/db/reviews";
import { reviewTable } from "../../../infra/db/reviews";
import { ProductName } from "../domain/name";
import { ProductStock } from "../domain/stock";
import { ProductPrice } from "../domain/price";
import { ReviewComment } from "../domain/reviewComment";
import { Rating } from "../domain/rating";
import { Review } from "../domain/review";
import { eq, sql } from "drizzle-orm";

export class ProductRepositoryImpl implements ProductRepository {
  private db = drizzle(dbPool, {
    schema: { ...productSchema, ...reviewSchema },
  });

  async deleteByBrandId(brandId: number): Promise<void> {
    await this.db
      .delete(productSchema.productTable)
      .where(eq(productTable.brandId, brandId));
  }

  async save(product: Product): Promise<Product> {
    const newProducts: (typeof productSchema.productTable.$inferSelect)[] = [];
    await this.db.transaction(async (trx) => {
      const ps = await trx
        .insert(productSchema.productTable)
        .values({
          categoryId: product.props.categoryId,
          brandId: product.props.brandId,
          name: product.props.name.props.value,
          price: product.props.price.props.value,
          stock: product.props.stock.props.value,
          isTopRated: product.props.isTopRated,
        })
        .returning();
      newProducts.push(...ps);

      await trx
        .insert(reviewTable)
        .values(
          product.props.reviews.map((review) => ({
            id: review.props.id,
            productId: product.props.id,
            userId: review.props.userId,
            rating: review.props.rating.props.value,
            comment: review.props.comment.props.value,
          })),
        )
        .onConflictDoUpdate({
          target: reviewTable.id,
          set: {
            rating: sql`EXCLUDED.rating`,
            comment: sql`EXCLUDED.comment`,
          },
        });
    });

    const newProduct = newProducts[0];
    return new Product({
      id: newProduct.id,
      name: product.props.name,
      price: product.props.price,
      stock: product.props.stock,
      brandId: product.props.brandId,
      categoryId: product.props.categoryId,
      createdAt: new Date(newProduct.createdAt),
      reviews: product.props.reviews,
    });
  }

  async getProductById(productId: number, withReviews = false) {
    const p = await this.db.query.productTable.findFirst({
      where: (product, { eq }) => eq(product.id, productId),
      with: {
        reviews: withReviews === true ? true : undefined,
      },
    });

    if (p === undefined) {
      return undefined;
    }

    return new Product({
      id: p.id,
      name: ProductName.unsafeCreate(p.name),
      price: ProductPrice.unsafeCreate(p.price),
      stock: ProductStock.unsafeCreate(p.stock),
      brandId: p.brandId,
      categoryId: p.categoryId,
      reviews: withReviews
        ? p.reviews.map(
            (review) =>
              new Review({
                id: review.id,
                userId: review.userId,
                productId: review.productId,
                rating: Rating.unsafeCreate(review.rating),
                comment: ReviewComment.unsafeCreate(review.comment),
              }),
          )
        : [],
      createdAt: new Date(p.createdAt),
    });
  }

  async getProducts(
    page: number,
    limit: number,
    withReviews?: boolean,
  ): Promise<Product[]> {
    const ps = await this.db.query.productTable.findMany({
      offset: (page - 1) * limit,
      limit,
      with: {
        reviews: withReviews === true ? true : undefined,
      },
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
          reviews: withReviews
            ? p.reviews.map(
                (review) =>
                  new Review({
                    id: review.id,
                    userId: review.userId,
                    productId: review.productId,
                    rating: Rating.unsafeCreate(review.rating),
                    comment: ReviewComment.unsafeCreate(review.comment),
                  }),
              )
            : [],
        }),
    );
  }
}
