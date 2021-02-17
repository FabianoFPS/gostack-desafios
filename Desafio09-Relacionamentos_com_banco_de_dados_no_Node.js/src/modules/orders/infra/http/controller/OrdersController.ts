import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const findOrder = container.resolve(FindOrderService);
    const { id } = request.params;
    try {
      const order = await findOrder.execute({ id });
      return response.json(order);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createOrder = container.resolve(CreateOrderService);
    const { customer_id, products } = request.body;

    try {
      const order = await createOrder.execute({
        customer_id,
        products,
      });
      return response.json(order);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
