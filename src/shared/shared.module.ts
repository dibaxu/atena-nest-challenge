import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateApiService } from './infrastructure/services/exchange-rate-api.service';

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: 'ICurrencyConversionService',
            useClass: ExchangeRateApiService,
        },
    ],
    exports: ['ICurrencyConversionService'],
})
export class SharedModule { }
