
import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionUseCase } from '../application/create-transaction.use-case';
import { CreateTransactionDto } from '../application/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) { }

    @Post()
    async create(@Body() dto: CreateTransactionDto) {
        await this.createTransactionUseCase.execute(dto);
        return { message: 'Transaction created successfully' };
    }
}
