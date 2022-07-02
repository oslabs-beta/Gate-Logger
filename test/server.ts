import express from 'express';

import gatelog from '../src/index';

const MOCK_PROJECT_ID = '62be51413c529fd1f8927060';
const MOCK_API_KEY = 'Knx897AkMs';

const app = express();

// logger middleware instantiation, changes res.end definition
app.use(gatelog(MOCK_PROJECT_ID, MOCK_API_KEY));

// mocking limiter middleware (to set res.locals.graphQLGate)
// this is in the case that a query goes through successfully
app.use((req, res, next) => {
    const MOCK_QUERY_DATA = {
        complexity: Math.round(Math.random() * 10), // query cost
        tokens: Math.round(Math.random() * 10), // tokens remaining
        success: Math.random() < 0.5,
    };

    res.locals.graphqlGate = MOCK_QUERY_DATA;

    return next();
});

/**
 * in theory, this res.send() should be calling not only res.end, but
 * also the functionality added to res.end by the logger middleware
 * upon its instantiation
 */
app.get('/', (req, res) => res.send('done'));

// for manual middleware tests
app.listen(3001, () => {
    console.log('test server running');
});

export default app;
