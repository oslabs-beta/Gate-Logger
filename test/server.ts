import express from 'express';
import bodyParser from 'body-parser';

import gatelog from '../src/index';

import { MOCK_API_KEY, MOCK_PROJECT_ID } from './mockConstants';

const app = express();

// logger middleware instantiation, changes res.end definition
app.use(gatelog(MOCK_PROJECT_ID, MOCK_API_KEY));

app.use(bodyParser.json());

// mocking limiter middleware (to set res.locals.graphQLGate)
// this is in the case that a query goes through successfully
app.use((req, res, next) => {
    res.locals.graphqlGate = req.body.mockQueryData;
    return next();
});

/**
 * this res.end() is in place for ending the middleware chain
 * and firing the event listener in gatelog's middleware callback.
 * one a response is sent back to the client, the functionality
 * within the event listener will execute
 */
app.use('/', (req, res) => {
    res.send(req.body.mockQueryData);
});

// // for manual middleware tests
// app.listen(3001, () => {
//     console.log('test server running');
// });

export default app;
