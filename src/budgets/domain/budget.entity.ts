
import { Money } from '../../shared/domain/value-objects/money.vo';
import { MonthYear } from '../../shared/domain/value-objects/month-year.vo';

export class Budget {
    constructor(
        private readonly id: string,
        private readonly category: string,
        private readonly limit: Money,
        private readonly monthYear: MonthYear,
    ) { }

    getId(): string {
        return this.id;
    }

    getCategory(): string {
        return this.category;
    }

    getLimit(): Money {
        return this.limit;
    }

    getMonthYear(): MonthYear {
        return this.monthYear;
    }
}
