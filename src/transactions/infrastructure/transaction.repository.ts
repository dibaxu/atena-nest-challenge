
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ITransactionRepository } from '../domain/transaction.repository.interface';
import { Transaction } from '../domain/transaction.entity';
import { TransactionEntity } from './transaction.entity';
import { Money } from '../../shared/domain/value-objects/money.vo';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly ormRepository: Repository<TransactionEntity>,
    ) { }

    async save(transaction: Transaction): Promise<void> {
        const entity = new TransactionEntity();
        entity.id = transaction.getId();
        entity.type = transaction.getType();
        entity.amount = transaction.getAmount().getAmount();
        entity.currency = transaction.getAmount().getCurrency();
        entity.category = transaction.getCategory();
        entity.date = transaction.getDate();
        entity.description = transaction.getDescription() || '';

        await this.ormRepository.save(entity);
    }

    async findAll(): Promise<Transaction[]> {
        const entities = await this.ormRepository.find();
        return entities.map(this.toDomain);
    }

    async findByMonth(month: number, year: number): Promise<Transaction[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const entities = await this.ormRepository.find({
            where: {
                date: Between(startDate, endDate),
            },
        });

        return entities.map(this.toDomain);
    }

    private toDomain(entity: TransactionEntity): Transaction {
        return new Transaction(
            entity.id,
            entity.type,
            new Money(Number(entity.amount), entity.currency),
            entity.category,
            entity.date,
            entity.description,
        );
    }
}
