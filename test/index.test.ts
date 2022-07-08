import 'jest';
import request from 'supertest';

import { LimQueryData } from '../@types/log';

import app from './server';

const currentTime: number = new Date().valueOf();

const MOCK_QUERY_DATA: LimQueryData = {
    complexity: Math.round(Math.random() * 10), // query cost
    tokens: Math.round(Math.random() * 10), // tokens remaining
    success: Math.random() < 0.5,
};

/**
 *
 * TESTING SUITE
 *
 */
describe('Logger End to End Test', () => {
    describe('successful query', () => {
        test('Test API with middleware runs without errors', (done) => {
            // merely checks if test API can run the middleware without errors
            request(app)
                .post('/')
                .set('Content-type', 'application/json')
                .send({
                    mockQueryData: MOCK_QUERY_DATA,
                })
                .expect(200)
                .expect(MOCK_QUERY_DATA)
                .end((err, res) => {
                    if (err) {
                        return err;
                    }
                    return done();
                });
        });
    });

    describe('unsuccessful query', () => {
        test('negative complexity passed into index', (done) => {
            const badMockQueryData: LimQueryData = {
                complexity: -1,
                tokens: 2,
                success: true,
            };
            const badData = {
                mockQueryData: badMockQueryData,
            };

            request(app)
                .post('/')
                .set('Content-type', 'application/json')
                .send(badData)
                .end((err, res) => {
                    if (err) {
                        console.log(`Supertest error: ${err}`);
                        return err;
                    }
                    return done();
                });
        });

        test('query failure and complexity value passed into index', (done) => {
            const badMockQueryData: LimQueryData = {
                complexity: 2,
                tokens: 2,
                success: false,
            };
            const badData = {
                mockQueryData: badMockQueryData,
            };

            request(app)
                .post('/')
                .set('Content-type', 'application/json')
                .send(badData)
                .end((err, res) => {
                    if (err) {
                        console.log(`Supertest error: ${err}`);
                        return err;
                    }
                    return done();
                });
        });
    });
});
