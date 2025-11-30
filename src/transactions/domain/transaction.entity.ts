
import { Money } from '../../shared/domain/value-objects/money.vo';
import { TransactionType } from './transaction-type.enum';

export class Transaction {
    constructor(
        private readonly id: string,
        private readonly type: TransactionType,
        private readonly amount: Money,
        private readonly category: string,
        private readonly date: Date,
        private readonly description?: string,
    ) { }

    getId(): string {
        return this.id;
    }

    getType(): TransactionType {
        return this.type;
    }

    getAmount(): Money {
        return this.amount;
    }

    getCategory(): string {
        return this.category;
    }

    getDate(): Date {
        return this.date;
    }

    getDescription(): string | undefined {
        return this.description;
    }
}
