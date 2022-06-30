import 'jest';
import request from 'supertest';

import app from './server';

// designed to mock the axios request made to the webapp to post a new query
const mockAxios = {
    post: jest.fn(() => Promise.resolve({ data: {} })),
};

/**
 *
 * TESTING SUITE
 *
 */
describe('Logger End to End Test', () => {
    console.log('running logger e2e test');
    describe('successful query', () => {
        console.log('running successful query');
        // tests that the data is posted to the webapp's backend
        // web server must be running to pass

        test('Correct data is posted to webapp when allowed by limiter', (done) => {
            console.log('running supertest');
            request(app)
                .get('/')
                .expect(200)
                .expect('done')
                .end((err, res) => {
                    if (err) {
                        return err;
                    }
                    done();
                });

            // request(app).get('/').expect(200).end();
            // expect(res.statusCode).toEqual(200);
        });
    });
});
