import { UniqueEntityID } from "@ddd/shared/domain";

export interface IDomainEvent {
  id: UniqueEntityID;
  dateTimeOccurred: Date;
}

