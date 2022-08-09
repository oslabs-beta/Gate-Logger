import 'jest';
import postQuery from '../../src/middleware/post';
import { LogQueryData } from '../../@types/log';

import { MOCK_PROJECT_ID, MOCK_URI } from '../mockConstants';

describe('Test API key header verification', () => {
    let mockURI: string;
    let mockProjectID: string;
    let mockQueryData: LogQueryData;

    let newPost: () => Promise<void | Error>;

    beforeEach(() => {
        /* The mock data below is pulled from a personal development dB.

       To perform some of these tests yourself, you must connect your dB
       to the webapp project and create a mock project with the webapp,
       then change these values to match the new data.
       */
        mockURI = MOCK_URI;
        mockProjectID = MOCK_PROJECT_ID;
        mockQueryData = {
            complexity: 4,
            timestamp: Date.now(),
            tokens: 8,
            success: true,
            loggedOn: 0,
            requestUuid: '0.0.0.0',
        };
    });

    test('error throws when query data is incorrect', () => {
        mockQueryData = {
            complexity: 3,
            timestamp: 100,
            tokens: -1,
            success: true,
            loggedOn: 0,
            requestUuid: '0.0.0.0',
        };

        newPost = async () => {
            await postQuery(mockURI, mockProjectID, mockQueryData);
        };

        expect(newPost).rejects.toThrowError();
    });

    test('No error thrown when query data is correct syntax', () => {
        newPost = async () => {
            await postQuery(mockURI, mockProjectID, mockQueryData);
        };

        expect(newPost).not.toThrow();
    });
});
