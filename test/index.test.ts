import 'jest';
import request from 'supertest';

import app from './server';

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
                    expect(res.statusCode).toEqual(200);
                    return res;
                });
        });
    });
});
