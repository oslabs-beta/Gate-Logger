import 'jest';
import request from 'supertest';

import app from './server';

// // designed to mock the axios request made to the webapp to post a new query
// const mockAxios = {
//     post: jest.fn(() => Promise.resolve({ data: {} })),
// };

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
                .get('/')
                .expect(200)
                .expect('done')
                .end((err, res) => {
                    if (err) {
                        return err;
                    }
                    return done();
                });
        });
    });
});
