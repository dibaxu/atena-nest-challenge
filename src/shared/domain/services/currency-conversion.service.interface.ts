export interface ICurrencyConversionService {
    convert(amount: number, from: string, to: string): Promise<number>;
}
