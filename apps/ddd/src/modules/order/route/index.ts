import express from "express";
import { CreateOrder } from "../useCase/createOrder";
import { OrderRepositoryImpl } from "../infra/orderRepositoryImpl";

const orderRouter = express.Router();


export interface CreateOrderArgs {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  userId: number;
  orderItems: {
    productName: string;
    productPrice: number;
    option?: string;
  }[];
}

orderRouter.post<any, any, any, CreateOrderArgs>("/", async (req, res) => {
  await new CreateOrder(new OrderRepositoryImpl()).execute(req.body);
  res.status(201).send();
});

export { orderRouter };
