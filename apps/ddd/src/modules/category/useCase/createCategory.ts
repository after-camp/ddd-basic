import { UseCase } from "@ddd/shared/core";
import { CategoryName, CategoryNameError } from "../domain/name";
import { Either } from "effect";
import { CreateCategoryArgs } from "../route";
import { ValueOf } from "type-fest";
import { CategoryRepository } from "../infra/categoryRepository";
import { NewCategoryDto } from "../dto/newCategoryDto";
import { Category } from "../domain/category";

export const CreateCategoryError = {
  CategoryNameAlreadyExists: "Category name already exists.",
};

type CreateCategoryError =
  | ValueOf<typeof CategoryNameError>
  | typeof CreateCategoryError.CategoryNameAlreadyExists;

export class CreateCategory implements UseCase<any, any> {
  constructor(private categoryRepository: CategoryRepository) {}
  public async execute(
    request: CreateCategoryArgs,
  ): Promise<Either.Either<CreateCategoryError, NewCategoryDto>> {
    const categoryNameOrError = CategoryName.create(request.name);

    if (Either.isLeft(categoryNameOrError)) {
      return Either.left(categoryNameOrError.left);
    }

    const categoryName = categoryNameOrError.right;

    const exists = await this.categoryRepository.existsByName(categoryName);
    if (exists) {
      return Either.left(CreateCategoryError.CategoryNameAlreadyExists);
    }

    const category = new Category({
      name: categoryName,
    });

    const newCategory = await this.categoryRepository.save(category);
    return Either.right(new NewCategoryDto(newCategory.props.id!));
  }
}
