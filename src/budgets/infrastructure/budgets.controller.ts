
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SetBudgetUseCase } from '../application/set-budget.use-case';
import { GetMonthlySummaryUseCase } from '../application/get-monthly-summary.use-case';
import { SetBudgetDto } from '../application/set-budget.dto';

@Controller('budgets')
export class BudgetsController {
    constructor(
        private readonly setBudgetUseCase: SetBudgetUseCase,
        private readonly getMonthlySummaryUseCase: GetMonthlySummaryUseCase,
    ) { }

    @Post()
    async setBudget(@Body() dto: SetBudgetDto) {
        await this.setBudgetUseCase.execute(dto);
        return { message: 'Budget set successfully' };
    }

    @Get('summary')
    async getSummary(@Query('month') month: string) {
        // month format YYYY-MM
        if (!month) {
            // default current month            
            const now = new Date();
            const year = now.getFullYear();
            const m = (now.getMonth() + 1).toString().padStart(2, '0');
            month = `${year}-${m}`;
        }
        return this.getMonthlySummaryUseCase.execute(month);
    }
}
