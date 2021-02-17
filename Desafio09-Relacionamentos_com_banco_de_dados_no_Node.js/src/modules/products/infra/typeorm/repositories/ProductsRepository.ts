import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    return this.ormRepository.save(product);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({
      where: {
        name,
      },
    });
  }

  /**
   * @tutorial 56:00
   */
  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // const productsFound: Product[] = [];

    // products.forEach(async product => {
    //   const findProduct = await this.ormRepository.findOne(product.id);
    //   if (findProduct) productsFound.push(findProduct);
    // });
    // return productsFound;

    const productsId = products.map(prod => prod.id);

    return this.ormRepository.find({
      where: {
        id: In(productsId),
      },
    });
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const udatedProducts: Product[] = [];

    products.forEach(async product => {
      const updateProduct = await this.ormRepository.findOne(product.id);
      if (updateProduct) {
        updateProduct.quantity = product.quantity;
        const updatedProduct = await this.ormRepository.save<Product>(
          updateProduct,
        );
        udatedProducts.push(updatedProduct);
      }
    });

    return udatedProducts;
  }
}

export default ProductsRepository;
