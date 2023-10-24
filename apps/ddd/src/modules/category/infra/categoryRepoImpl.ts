import { CategoryRepository } from "./categoryRepository";
import { drizzle } from "drizzle-orm/node-postgres";
import { dbPool } from "../../../infra/pool";
import { categoryTable } from "../../../infra/db/categories";
import { Category } from "../domain/category";
import { CategoryName } from "../domain/name";

export class CategoryRepoImpl implements CategoryRepository {
  private db = drizzle(dbPool, {
    schema: { categories: categoryTable },
  });

  public async save(category: Category) {
    const newCategories = await this.db
      .insert(categoryTable)
      .values({
        name: category.props.name.props.value,
        display: category.props.display,
      })
      .returning();

    const newCategory = newCategories[0];
    return new Category({
      id: newCategory.id,
      name: category.props.name,
      display: category.props.display,
    });
  }

  async existsByName(categoryName: CategoryName): Promise<boolean> {
    const c = await this.db.query.categories.findFirst({
      where: (categories, { eq }) =>
        eq(categories.name, categoryName.props.value),
    });

    return c !== undefined;
  }
}
