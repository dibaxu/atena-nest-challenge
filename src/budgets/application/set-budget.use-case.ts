
import { Inject, Injectable } from '@nestjs/common';
import type { IBudgetRepository } from '../domain/budget.repository.interface';
import { SetBudgetDto } from './set-budget.dto';
import { Budget } from '../domain/budget.entity';
import { Money } from '../../shared/domain/value-objects/money.vo';
import { MonthYear } from '../../shared/domain/value-objects/month-year.vo';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SetBudgetUseCase {
    constructor(
        @Inject('IBudgetRepository')
        private readonly budgetRepository: IBudgetRepository,
    ) { }

    async execute(dto: SetBudgetDto): Promise<void> {
        const money = new Money(dto.amount, dto.currency);
        const monthYear = MonthYear.fromString(dto.monthYear);

        // make sure if budget already exists for this category and month
        const existingBudget = await this.budgetRepository.findByCategoryAndMonth(
            dto.category,
            monthYear,
        );

        if (existingBudget) {
            // in this case for fast development  i update existing budget creating a new object with same ID but new limit
            // in a real app, we might want a method on the entity like 'updateLimit'
            const updatedBudget = new Budget(
                existingBudget.getId(),
                dto.category,
                money,
                monthYear,
            );
            await this.budgetRepository.save(updatedBudget);
        } else {
            const newBudget = new Budget(
                uuidv4(),
                dto.category,
                money,
                monthYear,
            );
            await this.budgetRepository.save(newBudget);
        }
    }
}
