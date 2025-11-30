
import { GetMonthlySummaryUseCase } from './get-monthly-summary.use-case';
import { IBudgetRepository } from '../domain/budget.repository.interface';
import { ITransactionRepository } from '../../transactions/domain/transaction.repository.interface';
import { Transaction } from '../../transactions/domain/transaction.entity';
import { Budget } from '../domain/budget.entity';
import { TransactionType } from '../../transactions/domain/transaction-type.enum';
import { Money } from '../../shared/domain/value-objects/money.vo';
import { MonthYear } from '../../shared/domain/value-objects/month-year.vo';

describe('GetMonthlySummaryUseCase', () => {
    let useCase: GetMonthlySummaryUseCase;
    let budgetRepository: jest.Mocked<IBudgetRepository>;
    let transactionRepository: jest.Mocked<ITransactionRepository>;

    beforeEach(() => {
        budgetRepository = {
            save: jest.fn(),
            findByCategoryAndMonth: jest.fn(),
            findAllByMonth: jest.fn(),
        };
        transactionRepository = {
            save: jest.fn(),
            findAll: jest.fn(),
            findByMonth: jest.fn(),
        };
        useCase = new GetMonthlySummaryUseCase(budgetRepository, transactionRepository);
    });

    it('should calculate monthly summary correctly', async () => {
        const monthYearStr = '2023-10';
        const monthYear = MonthYear.fromString(monthYearStr);

        // Mock Transactions
        const incomeTx = new Transaction(
            '1',
            TransactionType.INCOME,
            new Money(1000, 'USD'),
            'Salary',
            new Date('2023-10-01'),
        );
        const expenseTx1 = new Transaction(
            '2',
            TransactionType.EXPENSE,
            new Money(100, 'USD'),
            'Food',
            new Date('2023-10-05'),
        );
        const expenseTx2 = new Transaction(
            '3',
            TransactionType.EXPENSE,
            new Money(50, 'USD'),
            'Transport',
            new Date('2023-10-10'),
        );
        const expenseTx3 = new Transaction(
            '4',
            TransactionType.EXPENSE,
            new Money(200, 'USD'),
            'Food', // Another Food expense
            new Date('2023-10-15'),
        );

        transactionRepository.findByMonth.mockResolvedValue([incomeTx, expenseTx1, expenseTx2, expenseTx3]);

        // Mock Budgets
        const foodBudget = new Budget(
            'b1',
            'Food',
            new Money(250, 'USD'),
            monthYear,
        );
        const transportBudget = new Budget(
            'b2',
            'Transport',
            new Money(100, 'USD'),
            monthYear,
        );

        budgetRepository.findAllByMonth.mockResolvedValue([foodBudget, transportBudget]);

        const result = await useCase.execute(monthYearStr);

        expect(result.totalIncome).toBe(1000);
        expect(result.totalExpenses).toBe(350); // 100 + 50 + 200

        expect(result.categories).toHaveLength(2);

        const foodSummary = result.categories.find(c => c.category === 'Food');
        expect(foodSummary).toBeDefined();
        expect(foodSummary?.budget).toBe(250);
        expect(foodSummary?.spent).toBe(300); // 100 + 200
        expect(foodSummary?.remaining).toBe(-50);
        expect(foodSummary?.warning).toBe(true);

        const transportSummary = result.categories.find(c => c.category === 'Transport');
        expect(transportSummary).toBeDefined();
        expect(transportSummary?.budget).toBe(100);
        expect(transportSummary?.spent).toBe(50);
        expect(transportSummary?.remaining).toBe(50);
        expect(transportSummary?.warning).toBe(false);
    });
});
