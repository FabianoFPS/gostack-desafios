import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const deleteResult = await transactionRepository.delete({
      id,
    });

    if (deleteResult.affected === 0) {
      throw new AppError('Id not valid', 400);
    }
  }
}

export default DeleteTransactionService;
