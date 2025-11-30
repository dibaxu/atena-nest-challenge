
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { TransactionType } from '../domain/transaction-type.enum';

@Entity('transactions')
export class TransactionEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'simple-enum',
        enum: TransactionType,
    })
    type: TransactionType;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column()
    category: string;

    @Column()
    date: Date;

    @Column({ nullable: true })
    description: string;
}
