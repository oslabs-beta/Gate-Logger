import { Request, Response } from 'express';
import '@types/jest';

import AuthVerification from '../../src/middleware/APIAuth';

describe('Test API key header verification', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let resObj;

    /* The mock data below is pulled from a personal development dB.

       To perform some of these tests yourself, you must connect your dB
       to the webapp project and create a mock project with the webapp,
       then change these values to match the new data.
     
       */
    const mockProjectID = '628f0a525e7b5b620fe8af9b';
    const mockAPIKeyHeader = 'rhNKMO9vyI';

    /* this URL connects to the backend of the webapp, which must be running
       for some tests to work.
    */
    const newVerification = new AuthVerification('http://localhost:3000');

    // reset the mock request and mock result objects
    beforeEach(() => {
        mockReq = {};
        mockRes = {
            statusCode: 0,
            send: jest.fn().mockImplementation((result) => {
                resObj = result;
            }),
        };
    });

    describe('Logger Request Validation', () => {
        test('Error thrown when invalid webapp endpoint is provided', () => {});

        test('Error thrown when project ID is missing from endpoint query', () => {});

        test('Error thrown when invalid project ID is provided', () => {});

        test('Error thrown when API key header is missing from request', () => {});

        test('Error thrown when invalid API key header is provided', () => {});
    });

    describe('API Key Verification', () => {});
});
