
import { Transaction } from './transaction.entity';

export interface ITransactionRepository {
    save(transaction: Transaction): Promise<void>;
    findAll(): Promise<Transaction[]>;
    findByMonth(month: number, year: number): Promise<Transaction[]>;
}
