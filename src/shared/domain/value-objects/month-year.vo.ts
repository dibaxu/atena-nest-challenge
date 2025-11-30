
export class MonthYear {
    private readonly value: string;

    constructor(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        this.value = `${year}-${month}`;
    }

    static fromString(value: string): MonthYear {
        if (!/^\d{4}-\d{2}$/.test(value)) {
            throw new Error('Invalid MonthYear format. Expected YYYY-MM');
        }
        const [year, month] = value.split('-').map(Number);
        const date = new Date(year, month - 1);
        return new MonthYear(date);
    }

    toString(): string {
        return this.value;
    }

    equals(other: MonthYear): boolean {
        return this.value === other.value;
    }
}
