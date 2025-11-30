import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TransactionsController } from './../src/transactions/infrastructure/transactions.controller';
import { CreateTransactionUseCase } from './../src/transactions/application/create-transaction.use-case';

describe('TransactionsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                CreateTransactionUseCase,
                {
                    provide: 'ITransactionRepository',
                    useValue: {
                        save: jest.fn().mockResolvedValue(undefined),
                    },
                },
                {
                    provide: 'ICurrencyConversionService',
                    useValue: {
                        convert: jest.fn().mockImplementation((amount) => Promise.resolve(amount)),
                    },
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/transactions (POST)', () => {
        return request(app.getHttpServer())
            .post('/transactions')
            .send({
                type: 'EXPENSE',
                amount: 100,
                currency: 'USD',
                category: 'Food',
                date: '2023-10-01',
                description: 'Lunch',
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.message).toEqual('Transaction created successfully');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
