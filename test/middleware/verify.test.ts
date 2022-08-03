import 'jest';

import verification from '../../src/middleware/verify';

/* The mock data below is pulled from a personal development dB.

    To perform some of these tests yourself, you must connect your dB
    to the webapp project and create a mock project with the webapp,
    then change these values to match the new data.
*/
const MOCK_PROJECT_ID = '62be513b3c529fd1f8927058';
const MOCK_API_KEY = 'KYNHLO1SCq';
const MOCK_URI = 'http://localhost:3000';

let newVerification: () => Promise<void | Error>;

xdescribe('API Verification', () => {
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
