import { Money } from './money.vo';

describe('Money Value Object', () => {
    it('should create a Money instance with valid amount and currency', () => {
        const money = new Money(100, 'USD');
        expect(money.getAmount()).toBe(100);
        expect(money.getCurrency()).toBe('USD');
    });

    it('should throw an error if amount is negative', () => {
        expect(() => new Money(-50)).toThrow('Amount cannot be negative');
    });

    it('should add two Money instances with the same currency', () => {
        const m1 = new Money(100, 'USD');
        const m2 = new Money(50, 'USD');
        const result = m1.add(m2);
        expect(result.getAmount()).toBe(150);
        expect(result.getCurrency()).toBe('USD');
    });

    it('should throw an error when adding Money with different currencies', () => {
        const m1 = new Money(100, 'USD');
        const m2 = new Money(50, 'EUR');
        expect(() => m1.add(m2)).toThrow('Cannot add money with different currencies');
    });
});
