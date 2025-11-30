
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBudgetRepository } from '../domain/budget.repository.interface';
import { Budget } from '../domain/budget.entity';
import { BudgetEntity } from './budget.entity';
import { Money } from '../../shared/domain/value-objects/money.vo';
import { MonthYear } from '../../shared/domain/value-objects/month-year.vo';

@Injectable()
export class BudgetRepository implements IBudgetRepository {
    constructor(
        @InjectRepository(BudgetEntity)
        private readonly ormRepository: Repository<BudgetEntity>,
    ) { }

    async save(budget: Budget): Promise<void> {
        const entity = new BudgetEntity();
        entity.id = budget.getId();
        entity.category = budget.getCategory();
        entity.limit = budget.getLimit().getAmount();
        entity.currency = budget.getLimit().getCurrency();
        entity.monthYear = budget.getMonthYear().toString();

        await this.ormRepository.save(entity);
    }

    async findByCategoryAndMonth(category: string, monthYear: MonthYear): Promise<Budget | null> {
        const entity = await this.ormRepository.findOne({
            where: {
                category,
                monthYear: monthYear.toString(),
            },
        });

        if (!entity) return null;
        return this.toDomain(entity);
    }

    async findAllByMonth(monthYear: MonthYear): Promise<Budget[]> {
        const entities = await this.ormRepository.find({
            where: {
                monthYear: monthYear.toString(),
            },
        });

        return entities.map(this.toDomain);
    }

    private toDomain(entity: BudgetEntity): Budget {
        return new Budget(
            entity.id,
            entity.category,
            new Money(Number(entity.limit), entity.currency),
            MonthYear.fromString(entity.monthYear),
        );
    }
}
