import 'jest';
import request from 'supertest';

import app from './server';

const MOCK_QUERY_DATA: QueryData = {
    timestamp: 0, // unix timestamp
    complexity: 0, // query cost
    tokens: 0, // tokens remaining
    success: true,
};

/**
 *
 * TESTING SUITE
 *
 */
describe('Logger End to End Test', () => {
    describe('successful query', () => {
        // tests that the data is posted to the webapp's backend
        // web server must be running to pass

        test('Correct data is posted to webapp when allowed by limiter', () => {
            request(app)
                .get('/')
                .end((err, res) => {
                    if (err) {
                        return err;
                    }
                    expect(err).toBe(null);
                    expect(res.statusCode).toEqual(200);
                    expect(res.body).toEqual('done');
                });
        });
    });
});
