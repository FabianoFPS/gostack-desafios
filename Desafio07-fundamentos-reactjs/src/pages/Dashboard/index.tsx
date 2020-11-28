import React, { useState, useEffect } from 'react';

import incomeIco from '../../assets/income.svg';
import outcomeIco from '../../assets/outcome.svg';
import totalIco from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      api
        .get('transactions')
        .then(response => {
          const storageTransactions = response.data.transactions;
          const { income, outcome, total } = response.data.balance;

          const transactionsFormated = storageTransactions.map(
            (transaction: Transaction) => ({
              ...transaction,
              formattedValue:
                transaction.type === 'outcome'
                  ? `- ${formatValue(transaction.value)}`
                  : formatValue(transaction.value),
              formattedDate: new Date(transaction.created_at).toLocaleString(
                'pt-br',
              ),
            }),
          );

          const balanceFormated: Balance = {
            income: formatValue(income),
            outcome: formatValue(outcome),
            total: formatValue(total),
          };

          setTransactions(transactionsFormated);
          setBalance(balanceFormated);
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={incomeIco} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {balance ? balance.income : 'R$ 00,00'}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcomeIco} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {balance ? balance.outcome : 'R$ 00,00'}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={totalIco} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {balance ? balance.total : 'R$ 00,00'}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
