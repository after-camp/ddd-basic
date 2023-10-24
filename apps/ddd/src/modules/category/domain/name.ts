import { ValueObject } from "@ddd/shared/domain";
import { Either } from "effect";

interface CategoryNameProps {
  value: string;
}

export const CategoryNameError = {
  TooShort: "Category name must be at least 1 characters long.",
} as const;

export class CategoryName extends ValueObject<CategoryNameProps> {
  private constructor(props: CategoryNameProps) {
    super(props);
  }

  public static create(name: string) {
    if (name.length < 1) {
      return Either.left(CategoryNameError.TooShort);
    }

    return Either.right(new CategoryName({ value: name }));
  }
}
