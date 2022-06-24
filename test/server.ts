import express from 'express';

import gatelog from '../src/index';

const MOCK_PROJECT_ID = '62997af7a5aab6a6df935797';
const MOCK_API_KEY = 'Eo0sVUWQKM';

const MOCK_QUERY_DATA: QueryData = {
    timestamp: 0, // unix timestamp
    complexity: 0, // query cost
    tokens: 0, // tokens remaining
    success: true,
};

const app = express();

// logger middleware instantiation, changes res.end definition
app.use(gatelog(MOCK_PROJECT_ID, MOCK_API_KEY));

// mocking limiter middleware (to set res.locals.graphQLGate)
// this is in the case that a query goes through successfully
app.use((req, res, next) => {
    console.log('executed');
    res.locals.graphQLGate = MOCK_QUERY_DATA;
    return next();
});

// halt request at end of middleware chain
app.get('/', (req, res, next) => {
    /**
     * in theory, this res.send() should be calling not only res.end, but
     * also the functionality added to res.end by the logger middleware
     * upon its instantiation
     */

    return res.send('done');
});

export default app;
