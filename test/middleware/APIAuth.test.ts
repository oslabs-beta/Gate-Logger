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
        mockProjectID = '628f0a525e7b5b620fe8af9b';
        mockAPIKeyHeader = 'rhNKMO9vyI';
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
            validate = async () => {
                await newVerification.endpointValidation(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext as NextFunction
                );
            };
        });

        /*

            SKIP this test when the webapp server is running (it will fail)

        */
        test('throws error when webapp server not running', async () => {
            await expect(validate).rejects.toThrow('[Log API] Server not running');
        });

        /*

            When the webapp server is running, run these tests

        */

        test('does not throw error when webapp server is running', async () => {
            await expect(validate).not.toThrow('[Log API] Server not running');
        });

        // FAILING
        test('throws error when provided URL responds with error code', async () => {
            // set gateURI to inproper endpoint to expect a 404
            mockURI = 'http://localhost:3000/error';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            await expect(validate).rejects.toThrow('[Log API] Invalid Gateway URL provided');
        });

        test('throws error when invalid webapp endpoint is provided', async () => {
            mockReq.path = '/error';

            await expect(validate).rejects.toThrow(
                '[Log API] Endpoint in your request is invalid, format must be: /log?project=[projectID]'
            );
        });

        test('throws error when invalid project ID is provided', async () => {
            mockProjectID = 'error';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            await expect(validate).rejects.toThrow(
                '[Log API] Project ID in endpoint query is missing or invalid'
            );
        });

        test('throws error when invalid API key header is provided', async () => {
            mockAPIKeyHeader = 'error';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            await expect(validate).rejects.toThrow(
                '[Log API] Log_key header is an incorrect length, must be 10 characters.'
            );
        });

        test('goes onto next middleware when all syntax is correct', async () => {
            await newVerification.endpointValidation(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction
            );
            expect(mockNext).toBeCalledTimes(1);
        });
    });

    /*

        To test the AuthVerification.keyVerification middleware

    */
    describe('API Key Verification', () => {
        beforeAll(() => {
            verify = async () => {
                await newVerification.keyVerification(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext as NextFunction
                );
            };
        });

        // FAILING, receives undefined, not 403
        test('error 403 given when key provided does not match the key in dB', async () => {
            mockAPIKeyHeader = 'error';
            newVerification = new AuthVerification(mockURI, mockProjectID, mockAPIKeyHeader);

            verify();
            expect(resCode).toBe(403);
        });

        //
        test('DB key received in fetch is correct length', async () => {
            expect(verify).rejects.toThrow('[Log API] API key from DB is incorrect length.');
        });
    });
});
