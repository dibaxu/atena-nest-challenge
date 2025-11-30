
import { Budget } from './budget.entity';
import { MonthYear } from '../../shared/domain/value-objects/month-year.vo';

export interface IBudgetRepository {
    save(budget: Budget): Promise<void>;
    findByCategoryAndMonth(category: string, monthYear: MonthYear): Promise<Budget | null>;
    findAllByMonth(monthYear: MonthYear): Promise<Budget[]>;
}
