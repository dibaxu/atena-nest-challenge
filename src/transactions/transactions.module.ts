
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './infrastructure/transactions.controller';
import { CreateTransactionUseCase } from './application/create-transaction.use-case';
import { TransactionRepository } from './infrastructure/transaction.repository';
import { TransactionEntity } from './infrastructure/transaction.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
        SharedModule,
    ],
    controllers: [TransactionsController],
    providers: [
        CreateTransactionUseCase,
        {
            provide: 'ITransactionRepository',
            useClass: TransactionRepository,
        },
    ],
    exports: ['ITransactionRepository'],
})
export class TransactionsModule { }
