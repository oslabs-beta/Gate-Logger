import 'jest';

describe('Test API key header verification', () => {
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
        };
    });

    test('');
});
