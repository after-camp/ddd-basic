import { Entity, EntityClass, UniqueEntityID } from "@ddd/shared/domain";

export const OrderState = {
  Paid: 0,
  DELIVERY_READY: 1,
  DELIVERING: 2,
  DELIVERED: 3,
  CANCELED: 4,
} as const;

interface OrderItemProps {
  option?: string;
  orderId: string;
  orderState: (typeof OrderState)[keyof typeof OrderState];
  productName: string;
  productPrice: number;
}

@Entity
export class OrderItem extends EntityClass<OrderItemProps> {
  static create(props: OrderItemProps, id?: number) {
    return new OrderItem(
      props,
      new UniqueEntityID(id),
    );
  }
}
