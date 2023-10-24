import { Category } from "../domain/category";
import { CategoryName } from "../domain/name";

export interface CategoryRepository {
  save: (category: Category) => Promise<Category>;
  existsByName(categoryName: CategoryName): Promise<boolean>;
}
