import { AggregateRoot, Entity, UniqueEntityID } from "@ddd/shared/domain";
import { OrderItem } from "./orderItem";

interface OrderProps {
  userId: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  orderItems: OrderItem[];
}

@Entity
export class Order extends AggregateRoot<OrderProps> {
  constructor(props: OrderProps, id: string) {
    super(props, new UniqueEntityID(id));
  }
}
