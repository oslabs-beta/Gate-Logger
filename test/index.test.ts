import 'jest';

const MOCK_PROJECT_ID: string = '62997af7a5aab6a6df935797';
const MOCK_API_KEY: string = 'Eo0sVUWQKM';

const MOCK_QUERY_DATA: QueryData = {
    timestamp: 0, // unix timestamp
    complexity: 0, // query cost
    tokens: 0, // tokens remaining
    success: true,
};

// models the NoSQL database used by the webapp backend
const MOCK_DB = {
    Users: [
        {
            id: '62997adfa5aab6a6df935792',
            email: '1',
        },
        {
            id: '62997adfa5aab6a6df935793',
            email: '2',
        },
    ],
    Projects: [
        {
            id: '62997af7a5aab6a6df935797',
            userID: '62997adfa5aab6a6df935792',
            name: '1',
            apiKey: 'Eo0sVUWQKM',
        },
        {
            id: '62997af7a5aab6a6df935798',
            userID: '62997adfa5aab6a6df935793',
            name: '2',
            apiKey: 'Eo0sVUWQKN',
        },
    ],
    Queries: [
        // query that has been allowed through by the limiter
        {
            id: '6299a2cd859e4b82bda9aad9',
            userID: '62997af7a5aab6a6df935797',
            projectID: '62997adfa5aab6a6df935792',
            number: 1,
            depth: 0,
            complexity: 0,
            timestamp: 0,
            tokens: 0,
            success: true,
        },
        // same data, but this query has been blocked by the limiter
        {
            id: '6299a3aee9ed2aa5e4d33db4',
            userID: '62997af7a5aab6a6df935797',
            projectID: '62997adfa5aab6a6df935792',
            number: 1,
            depth: 0,
            complexity: 0,
            timestamp: 0,
            tokens: 0,
            success: false,
        },
    ],
};

describe('Logger End to End Test', () => {
    let mockProjectID: string;
    let mockAPIKey: string;
    let mockQueryData: QueryData;

    beforeEach(() => {
        mockProjectID = MOCK_PROJECT_ID;
        mockAPIKey = MOCK_API_KEY;
        mockQueryData = MOCK_QUERY_DATA;
    });

    // test that the data is sent when a query is allowed by the limiter
    xtest('', () => {});
});
