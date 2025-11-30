
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('budgets')
export class BudgetEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    category: string;

    @Column('decimal', { precision: 10, scale: 2 })
    limit: number;

    @Column()
    currency: string;

    @Column()
    monthYear: string; // as "YYYY-MM"
}
