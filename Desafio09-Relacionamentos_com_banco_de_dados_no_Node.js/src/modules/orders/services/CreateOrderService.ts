import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('RgOrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('RgProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('RgCustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) throw new AppError('Customer not exists');

    const productsExists = await this.productsRepository.findAllById(products);

    if (products.length !== productsExists.length)
      throw new AppError('Product not found.');

    const productsUpdateQuantity: IUpdateProductsQuantityDTO[] = [];
    const productsOrder: {
      product_id: string;
      price: number;
      quantity: number;
    }[] = [];

    productsExists.forEach(productExists => {
      const findProduct = products.find(
        productRequest => productRequest.id === productExists.id,
      );

      if (!findProduct) throw new AppError('Product not found.');

      if (productExists.quantity < findProduct.quantity)
        throw new AppError(
          `insufficient quantity, product: ${productExists.name} (quamtity: ${productExists.quantity})`,
        );

      productsUpdateQuantity.push({
        id: productExists.id,
        quantity: productExists.quantity - findProduct.quantity,
      });

      productsOrder.push({
        product_id: productExists.id,
        quantity: findProduct.quantity,
        price: productExists.price,
      });
    });

    await this.productsRepository.updateQuantity(productsUpdateQuantity);

    return this.ordersRepository.create({
      customer,
      products: productsOrder,
    });
  }
}

export default CreateOrderService;
