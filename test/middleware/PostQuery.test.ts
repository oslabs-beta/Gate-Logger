import 'jest';
import postQuery from '../../src/middleware/PostQuery';
import { QueryData } from '../../@types/log';

xdescribe('Test API key header verification', () => {
    let mockURI: string;
    let mockProjectID: string;
    let mockQueryData: QueryData;

    beforeEach(() => {
        /* The mock data below is pulled from a personal development dB.

       To perform some of these tests yourself, you must connect your dB
       to the webapp project and create a mock project with the webapp,
       then change these values to match the new data.
       */
        mockURI = 'http://localhost:3000';
        mockProjectID = '62997af7a5aab6a6df935797';
        mockQueryData = {
            complexity: 4,
            timestamp: Date.now(),
            tokens: 8,
            success: true,
            loggedOn: 0,
        };
    });

    test('error throws when query data is incorrect', async () => {
        mockQueryData = {
            complexity: 3,
            timestamp: 100,
            tokens: -1,
            success: true,
            loggedOn: 0,
        };
        const newPost = () => postQuery(mockURI, mockProjectID, mockQueryData);

        await expect(newPost).rejects.toThrow(`[gatelog] Query data cannot be negative.`);
    });

    test('Error thrown when resulting projectID of query does not match the one entered', async () => {
        const newPost = () => postQuery(mockURI, mockProjectID, mockQueryData);

        await expect(newPost).not.toThrow(
            `[gatelog] GraphQL error, resulting query's projectID does not match the one entered`
        );
    });

    test('No error thrown when query data is correct syntax', async () => {
        const newPost = () => postQuery(mockURI, mockProjectID, mockQueryData);

        await expect(newPost).not.toThrow();
    });
});
