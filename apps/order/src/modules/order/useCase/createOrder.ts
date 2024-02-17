import { UseCase } from "@ddd/shared/core";
import { CreateOrderArgs } from "../route";
import { OrderItem, OrderState } from "../domain/orderItem";
import { Order } from "../domain/order";
import { NewOrderDto } from "../dto/newOrderDto";
import { OrderRepository } from "../infra/orderRepository";
import { v4 as uuidv4 } from "uuid";

export class CreateOrder implements UseCase<any, any> {
  constructor(private orderRepository: OrderRepository) {}
  public async execute(request: CreateOrderArgs): Promise<NewOrderDto> {
    const orderId = uuidv4();
    const orderItems = request.orderItems.map((orderItem) =>
      OrderItem.create({ ...orderItem, orderState: OrderState.Paid, orderId }),
    );
    const order = new Order(
      {
        userId: request.userId,
        receiverName: request.receiverName,
        receiverPhone: request.receiverPhone,
        receiverAddress: request.receiverAddress,
        orderItems,
      },
      orderId,
    );

    const newOrder = await this.orderRepository.save(order);
    return new NewOrderDto(newOrder.id.toString());
  }
}
