import { IDomainEvent } from "../../../../../../../shared/src/lib/domain/events/IDomainEvent";
import { UniqueEntityID } from "@ddd/shared/domain";

export class BrandDeleted implements IDomainEvent {
  readonly dateTimeOccurred: Date;
  readonly id: UniqueEntityID;

  constructor(public readonly data: { id: number }) {
    this.dateTimeOccurred = new Date();
    this.id = new UniqueEntityID(data.id);
  }
}
