import { EntityClass } from "@ddd/shared/domain";
import { CategoryName } from "./name";

interface CategoryProps {
  id?: number;
  name: CategoryName;
  display?: boolean;
}

export class Category extends EntityClass<CategoryProps> {
  constructor(props: CategoryProps) {
    super({ id: props.id, name: props.name, display: props.display ?? false });
  }
}
