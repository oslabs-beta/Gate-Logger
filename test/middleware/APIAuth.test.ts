import { Request, Response, NextFunction } from 'express';
import 'jest';

import AuthVerification from '../../src/middleware/APIAuth';

describe('Test API key header verification', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    const mockNext: NextFunction = jest.fn();

    let resObj;
    let resCode: number;

    let mockURI: string;
    let mockProjectID: string;
    let mockAPIKeyHeader: string;

    /* this URL connects to the backend of the webapp (not the test server), which must be running
       for some tests to work.
       */
    let newVerification: AuthVerification;

    let validate = () => {};
    let verify = () => {};

    /* reset the mock request and mock result objects
       by default, all of this mock data will have correct syntax
       */
    beforeEach(() => {
        /* The mock data below is pulled from a personal development dB.

       To perform some of these tests yourself, you must connect your dB
       to the webapp project and create a mock project with the webapp,
       then change these values to match the new data.
       */
        mockProjectID = '62997af7a5aab6a6df935797';
        mockAPIKeyHeader = 'Eo0sVUWQKM';
        mockURI = 'http://localhost:3000';

        mockReq = {
            query: {
                project: mockProjectID,
            },
            path: `/log`,
            headers: {
                log_key: mockAPIKeyHeader,
            },
        };
        mockRes = {
            json: jest.fn().mockImplementation((result) => {
                resObj = result;
            }),
            send: jest.fn().mockImplementation((result) => {
                resObj = result;
            }),
            sendStatus: jest.fn().mockImplementation((code) => {
                resCode = code;
            }),
        };

        newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);
    });

    /*

        To test the AuthVerification.endpointValidation middleware

    */
    describe('Logger Request Validation', () => {
        beforeEach(() => {
            validate = async () => await newVerification.validation();
        });

        /*


            SKIP this test when the webapp server is running (it will fail)
        */
        xtest('throws error when webapp server not running', async () => {
            await expect(validate).rejects.toThrow('[Log API] Server not running');
        });

        /*


            When the webapp server is running, run these tests
        */
        test('does not throw error when webapp server is running', async () => {
            await expect(validate).not.toThrow('[Log API] Server not running');
        });

        test('throws error when invalid project ID is provided', async () => {
            mockProjectID = 'error';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            await expect(validate).rejects.toThrow(
                '[Log API] Project ID passed into middleware is invalid'
            );
        });

        test('throws error when invalid API key header is provided', async () => {
            mockAPIKeyHeader = 'error';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            await expect(validate).rejects.toThrow(
                '[Log API] Log_key header is an incorrect length, must be 10 characters.'
            );
        });

        test('validate returns when all syntax is correct', async () => {
            await expect(validate).not.toThrow();
        });
    });

    /*

        To test the AuthVerification.keyVerification middleware

    */
    describe('API Key Verification', () => {
        beforeAll(() => {
            verify = async () => {
                await newVerification.verification();
            };
        });

        test('throws when key provided does not match the key in dB', async () => {
            mockAPIKeyHeader = '10kcharact';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            expect(verify).rejects.toThrow(
                '[Log API] The log_key provided in header does not match the key of the project specified'
            );
        });

        //
        test('DB key received in fetch is correct length', async () => {
            expect(verify).rejects.toThrow('[Log API] API key from DB is incorrect length.');
        });
    });
});
