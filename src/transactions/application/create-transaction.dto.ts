
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { TransactionType } from '../domain/transaction-type.enum';

export class CreateTransactionDto {
    @IsEnum(TransactionType)
    @IsNotEmpty()
    type: TransactionType;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsOptional()
    description?: string;
}
