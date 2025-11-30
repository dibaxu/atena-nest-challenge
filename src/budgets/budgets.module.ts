
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './infrastructure/budgets.controller';
import { SetBudgetUseCase } from './application/set-budget.use-case';
import { GetMonthlySummaryUseCase } from './application/get-monthly-summary.use-case';
import { BudgetRepository } from './infrastructure/budget.repository';
import { BudgetEntity } from './infrastructure/budget.entity';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BudgetEntity]),
        TransactionsModule,
    ],
    controllers: [BudgetsController],
    providers: [
        SetBudgetUseCase,
        GetMonthlySummaryUseCase,
        {
            provide: 'IBudgetRepository',
            useClass: BudgetRepository,
        },
    ],
})
export class BudgetsModule { }
