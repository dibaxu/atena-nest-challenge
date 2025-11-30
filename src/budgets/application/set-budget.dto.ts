
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class SetBudgetDto {
    @IsString()
    @IsNotEmpty()
    category: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @Matches(/^\d{4}-\d{2}$/, { message: 'monthYear must be in format YYYY-MM' })
    monthYear: string;
}
