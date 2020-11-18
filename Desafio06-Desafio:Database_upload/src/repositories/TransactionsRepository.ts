import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionList {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<TransactionList> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (accumulator, transaction) => {
        const calcBalance = {
          income: (value: number): void => {
            accumulator.income += value;
            accumulator.total += value;
          },
          outcome: (value: number): void => {
            accumulator.outcome += value;
            accumulator.total -= value;
          },
        };
        calcBalance[transaction.type](transaction.value);
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return { transactions, balance } || null;
  }
}

export default TransactionsRepository;
