import { IDomainEvent } from "../../../../../../shared/src/lib/domain/events/IDomainEvent";
import { DeleteProducts } from "../useCase/deleteProducts";
import { ProductRepositoryImpl } from "./productRepoImpl";

export class ProductEventHandler {
  static handle(event: IDomainEvent) {
    switch (event.constructor.name) {
      case "BrandDeleted":
        new DeleteProducts(new ProductRepositoryImpl()).execute(event.id);
        break;
      default:
        throw new Error("Unknown event");
    }
  }
}
