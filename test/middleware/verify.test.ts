import 'jest';

import verification from '../../src/middleware/verify';

import { MOCK_API_KEY, MOCK_PROJECT_ID, MOCK_URI } from '../mockConstants';

let newVerification: () => Promise<void | Error>;

describe('API Verification', () => {
    beforeEach(async () => {
        newVerification = async () => {
            await verification(MOCK_URI, MOCK_PROJECT_ID, MOCK_API_KEY);
        };
    });
    /*
            SKIP this test when the webapp server is running (it will fail)
        */
    xtest('throws when webapp server not running', () => {
        expect(newVerification).rejects.toThrow('[Log API] Server not running');
    });
    /*
     */

    test('throws when invalid project ID is provided', () => {
        newVerification = async () => {
            await verification(MOCK_URI, 'error', MOCK_API_KEY);
        };

        expect(newVerification).rejects.toThrow();
    });

    test('throws when invalid API key header is provided', () => {
        newVerification = async () => {
            await verification(MOCK_URI, MOCK_PROJECT_ID, 'error');
        };

        expect(newVerification).rejects.toThrowError();
    });

    test('throws when key provided does not match the key in dB', () => {
        newVerification = async () => {
            await verification(MOCK_URI, MOCK_PROJECT_ID, '10kcharact');
        };

        expect(newVerification).rejects.toThrow();
    });

    test('no errors when keys match', () => {
        expect(newVerification).not.toThrow();
    });
});
