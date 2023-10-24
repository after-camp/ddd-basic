import { Category } from "../domain/category";

export interface CategoryRepository {
  save: (category: Category) => Promise<Category>;
}
