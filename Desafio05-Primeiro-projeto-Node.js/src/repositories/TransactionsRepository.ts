import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Resume {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Resume {
    const balance = this.getBalance();

    return {
      transactions: [...this.transactions],
      balance,
    };
  }

  public getBalance(): Balance {
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

    const income = this.transactions.reduce(getIncome, 0);
    const outcome = this.transactions.reduce(getOutcome, 0);
    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }

  public create({ title, value, type }: Request): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
