
import { Inject, Injectable } from '@nestjs/common';
import type { ITransactionRepository } from '../domain/transaction.repository.interface';
import { CreateTransactionDto } from './create-transaction.dto';
import { Transaction } from '../domain/transaction.entity';
import { Money } from '../../shared/domain/value-objects/money.vo';
import { v4 as uuidv4 } from 'uuid';

import type { ICurrencyConversionService } from '../../shared/domain/services/currency-conversion.service.interface';

@Injectable()
export class CreateTransactionUseCase {
    constructor(
        @Inject('ITransactionRepository')
        private readonly transactionRepository: ITransactionRepository,
        @Inject('ICurrencyConversionService')
        private readonly currencyService: ICurrencyConversionService,
    ) { }

    async execute(dto: CreateTransactionDto): Promise<void> {
        let amount = dto.amount;
        let currency = dto.currency;

        if (currency !== 'USD') {
            amount = await this.currencyService.convert(amount, currency, 'USD');
            currency = 'USD';
        }

        const money = new Money(amount, currency);
        const transaction = new Transaction(
            uuidv4(),
            dto.type,
            money,
            dto.category,
            new Date(dto.date),
            dto.description,
        );

        await this.transactionRepository.save(transaction);
    }
}
