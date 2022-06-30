import express from 'express';

// import QueryData from '../@types/log.d';

import gatelog from '../src/index';

const MOCK_PROJECT_ID = '62bd14253f9bee60f2922c42';
const MOCK_API_KEY = '6bxwViAIla';

const MOCK_QUERY_DATA = {
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
    // console.log('executed');
    res.locals.graphqlGate = MOCK_QUERY_DATA;
    // console.log(res.locals);
    return next();
});

// halt request at end of middleware chain
app.get('/', (req, res, next) => {
    /**
     * in theory, this res.send() should be calling not only res.end, but
     * also the functionality added to res.end by the logger middleware
     * upon its instantiation
     */
    console.log('response sent');
    return res.send('done');
});

// for manual middleware tests
app.listen(3001, () => {
    console.log('test server running');
});

export default app;