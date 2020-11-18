import { getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import UploadConfig from '../config/upload';
import Category from '../models/Category';

interface NewTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(UploadConfig.directory, filename);
    const data = await this.loadCSV(csvFilePath);

    // const trasactionsCreated: Transaction[] = [];
    // const createTransaction = new CreateTransactionService();
    // data.forEach(async transaction => {
    //   const [title, $ype, $value, category] = transaction;
    //   const value = parseFloat($value);
    //   const newTran = await createTransaction.execute({
    //     title,
    //     value,
    //     type: $ype as 'income' | 'outcome',
    //     category,
    //   });
    //   trasactionsCreated.push(newTran);
    // });
    const transactions: NewTransaction[] = [];
    const categories: string[] = [];

    data.forEach(linha => {
      const [title, type, value, category] = linha;
      if (!title || !type || !value) return;
      categories.push(category);
      transactions.push({
        title,
        type: type as 'income' | 'outcome',
        value: parseFloat(value),
        category,
      });
    });
    const categoriesRepository = getRepository(Category);
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      category => category.title,
    );

    const addCategoriesTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoriesTitles.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...existentCategories, ...newCategories];
    const transactionRepository = getRepository(Transaction);

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);

    return createdTransactions;
  }

  async loadCSV(csvFilePath: string): Promise<string[][]> {
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[][] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
