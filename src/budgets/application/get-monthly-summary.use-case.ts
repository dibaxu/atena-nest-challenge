
import { Inject, Injectable } from '@nestjs/common';
import type { IBudgetRepository } from '../domain/budget.repository.interface';
import type { ITransactionRepository } from '../../transactions/domain/transaction.repository.interface';
import { MonthYear } from '../../shared/domain/value-objects/month-year.vo';
import { TransactionType } from '../../transactions/domain/transaction-type.enum';

export interface CategorySummary {
    category: string;
    budget: number;
    spent: number;
    remaining: number;
    warning: boolean;
}

export interface MonthlySummaryDto {
    totalIncome: number;
    totalExpenses: number;
    categories: CategorySummary[];
}

@Injectable()
export class GetMonthlySummaryUseCase {
    constructor(
        @Inject('IBudgetRepository')
        private readonly budgetRepository: IBudgetRepository,
        @Inject('ITransactionRepository')
        private readonly transactionRepository: ITransactionRepository,
    ) { }

    async execute(monthYearStr: string): Promise<MonthlySummaryDto> {
        const monthYear = MonthYear.fromString(monthYearStr);
        const [year, month] = monthYear.toString().split('-').map(Number);

        // transactions for the month
        const transactions = await this.transactionRepository.findByMonth(month, year);

        // budgets for the month
        const budgets = await this.budgetRepository.findAllByMonth(monthYear);

        let totalIncome = 0;
        let totalExpenses = 0;
        const expensesByCategory: Record<string, number> = {};

        // here i calculate totals and group expenses by category
        for (const tx of transactions) {
            const amount = tx.getAmount().getAmount();
            if (tx.getType() === TransactionType.INCOME) {
                totalIncome += amount;
            } else {
                totalExpenses += amount;
                const category = tx.getCategory();
                expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
            }
        }

        // category summaries based on budgets
        const categories: CategorySummary[] = budgets.map((budget) => {
            const category = budget.getCategory();
            const limit = budget.getLimit().getAmount();
            const spent = expensesByCategory[category] || 0;

            return {
                category,
                budget: limit,
                spent,
                remaining: limit - spent,
                warning: spent > limit,
            };
        });

        return {
            totalIncome,
            totalExpenses,
            categories,
        };
    }
}
