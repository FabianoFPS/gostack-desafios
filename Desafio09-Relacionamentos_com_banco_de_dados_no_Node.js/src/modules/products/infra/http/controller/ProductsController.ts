import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createProduct = container.resolve(CreateProductService);
    const { name, price, quantity } = request.body;
    try {
      const product = await createProduct.execute({
        name,
        price,
        quantity,
      });

      return response.json(product);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
