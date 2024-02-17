import { OrderRepository } from "./orderRepository";
import { Order } from "../domain/order";
import { drizzle } from "drizzle-orm/node-postgres";
import { OrderItem } from "../domain/orderItem";
import { orderTable } from "../../../infra/db/orders";
import { dbPool } from "../../../infra/pool";
import { orderItemsTable } from "../../../infra/db/orderItems";

export class OrderRepositoryImpl implements OrderRepository {
  private db = drizzle(dbPool, {
    schema: { ...orderTable },
  });

  public async save(order: Order): Promise<Order> {
    let newOrder: Order;
    await this.db.transaction(async (trx) => {
      const o = await trx
        .insert(orderTable)
        .values({
          id: order.id.toString(),
          receiverName: order.props.receiverName,
          userId: order.props.userId,
          receiverPhone: order.props.receiverPhone,
          receiverAddress: order.props.receiverAddress,
        })
        .returning();

      const values = order.props.orderItems.map(
        (orderItem) =>
          ({
            orderId: o[0].id,
            productId: orderItem.props.productId,
            productName: orderItem.props.productName,
            orderState: orderItem.props.orderState,
            productPrice: orderItem.props.productPrice,
          }) satisfies typeof orderItemsTable.$inferInsert,
      );

      const orderItems = await trx
        .insert(orderItemsTable)
        .values(values)
        .returning();

      newOrder = new Order(
        {
          userId: o[0].userId,
          receiverName: o[0].receiverName,
          receiverPhone: o[0].receiverPhone,
          receiverAddress: o[0].receiverAddress,
          orderItems: orderItems.map((orderItem) =>
            OrderItem.create(
              {
                productId: orderItem.productId,
                productName: orderItem.productName,
                orderState: orderItem.orderState as any,
                productPrice: orderItem.productPrice,
                orderId: orderItem.orderId,
              },
              orderItem.id,
            ),
          ),
        },
        o[0].id,
      );
    });

    return newOrder;
  }
}
