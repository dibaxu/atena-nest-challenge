import { Injectable, Logger, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, retry, catchError, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { ICurrencyConversionService } from '../../domain/services/currency-conversion.service.interface';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExchangeRateApiService implements ICurrencyConversionService {
    private readonly logger = new Logger(ExchangeRateApiService.name);
    private readonly apiKey: string;
    private readonly baseUrl = 'https://v6.exchangerate-api.com/v6';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const key = this.configService.get<string>('EXCHANGE_RATE_API_KEY');
        if (!key) {
            throw new Error('EXCHANGE_RATE_API_KEY is not defined in environment variables');
        }
        this.apiKey = key;
    }

    async convert(amount: number, from: string, to: string): Promise<number> {
        if (from === to) {
            return amount;
        }

        const url = `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}/${amount}`;
        // timeoutes and retries
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(url).pipe(
                    timeout(5000),
                    retry(3),
                    catchError((error: AxiosError) => {
                        this.logger.error(`Error fetching exchange rate: ${error.message}`);
                        return throwError(() => error);
                    }),
                ),
            );

            if (data.result === 'success') {
                return data.conversion_result;
            } else {
                this.logger.error(`Exchange API error: ${data['error-type']}`);
                throw new BadRequestException(`Currency conversion failed: ${data['error-type']}`);
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Currency conversion service failed`, error);
            throw new ServiceUnavailableException('Currency conversion service is currently unavailable');
        }
    }
}
