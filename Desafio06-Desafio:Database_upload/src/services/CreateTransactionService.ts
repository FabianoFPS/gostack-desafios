import { getRepository } from 'typeorm';

// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string | Category;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const validOperation = await this.validOperation(type, value);

    if (!validOperation) {
      throw new AppError('The value exceeds the total');
    }

    let findCategory = await this.findCategory(category as string);

    if (!findCategory)
      findCategory = await this.createCategory(category as string);

    const newTransaction = await this.createTransaction({
      title,
      type,
      value,
      category: findCategory,
    });

    return newTransaction;
  }

  private async validOperation(
    type: 'income' | 'outcome',
    valueOfOutcome: number,
  ): Promise<boolean> {
    if (type === 'income') return true;
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();

    function getIncome(acc: number, transaction: Transaction): number {
      if (transaction.type === 'income') {
        return acc + transaction.value;
      }
      return acc;
    }

    function getOutcome(acc: number, transaction: Transaction): number {
      if (transaction.type === 'outcome') {
        return acc + transaction.value;
      }
      return acc;
    }

    const income = transactions.reduce(getIncome, 0);
    const outcome = transactions.reduce(getOutcome, 0);
    const total = income - outcome;

    return !(total < valueOfOutcome);
  }

  private async createTransaction({
    title,
    type,
    value,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const newTransaction = transactionRepository.create({
      title,
      type,
      value,
      category: category as Category,
    });

    const transactionCreated = await transactionRepository.save(newTransaction);

    return transactionCreated;
  }

  private async createCategory(title: string): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const newCategory = categoryRepository.create({
      title,
    });

    const categoryCreaated = await categoryRepository.save(newCategory);
    return categoryCreaated;
  }

  private async findCategory(category: string): Promise<Category | undefined> {
    const categoryRepository = getRepository(Category);
    const findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    return findCategory;
  }
}

export default CreateTransactionService;
