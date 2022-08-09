import { Request, Response, NextFunction } from 'express';

import verification from './middleware/verify';
import postQuery from './middleware/post';
import { MOCK_URI } from '../test/mockConstants';

// URI pointing to the visual webapp
const gateURI = MOCK_URI;

/**
 * @function gatelog runs along with the helper functions
 * first, authorizes the user's request to post to the webapp
 * using params. This middleware should be called BEFORE the
 * rate-limiting middleware in order to log blocked requests &
 * allow the limiter to kill requests that must be blocked,
 * but it also needs to throw an error if the limiter is not setup.
 *
 *
 * Therefore, this middlware should be placed before the limiter
 * e.g. app.use(gatelog(params...))
 *      app.use(gatelimiter(params...))
 *
 * The gate log adds functionality into a res.on('finish', ()=>{})
 * event listener designed to fire once the response gets sent back to
 * the client. This will make sure that the logger has now received data
 * from the limiter regarding the current query, and now can send this data
 * to the web app's backend.
 *
 *
 * @param projectID points to the user's project in the webapp backend
 *
 * @param apiKey the authorization code the user provides to post
 *               to the webapp's backend
 *
 */

// instantation, everything before the return callback runs only once
export default function gateLogger(projectID: string, apiKey: string) {
    verification(gateURI, projectID, apiKey)
        .then((res) => {
            if (res instanceof Error)
                throw new SyntaxError(
                    `[gatelog] Error with server, project ID, or API key:\n${res}`
                );
        })
        .catch((err) => {
            throw new Error(`[gatelog] Error verifying:\n${err}`);
        });

    // every time a request is processed in the user's backend,
    // this express middleware callback will run
    return (req: Request, res: Response, next: NextFunction) => {
        // calls initial timestamp of request's beginning,
        // this will depend on where logger is placed in middleware chain
        const timestamp: number = new Date().valueOf();

        // runs logger's functionality upon response being sent back to client
        res.on('finish', async (): Promise<void> => {
            // checks if data from limiter middleware contains required properties,
            // logs error otherwise to fail without crashing the server
            if (
                !(
                    // prettier-ignore
                    // eslint-disable-next-line no-prototype-builtins
                    res.locals.graphqlGate?.hasOwnProperty('success') &&
                        // eslint-disable-next-line no-prototype-builtins
                        res.locals.graphqlGate?.hasOwnProperty('tokens')
                )
            ) {
                console.log(
                    new SyntaxError(
                        `[gatelog] Error: Limiter is not including required query properties: success & tokens\n`
                    )
                );
                return;
            }
            // calls timestamp of request's end
            const loggedOn: number = new Date().valueOf();

            // stores time between request's beginning and end
            const latency: number = loggedOn - timestamp;

            const result = await postQuery(gateURI, projectID, {
                ...res.locals.graphqlGate,
                requestUuid: req.ips ? req.ips[0] : req.ip,
                timestamp,
                loggedOn,
                latency,
            }).catch((err) => {
                console.log(new Error(`postQuery.post threw an error: ${err}`));
            });

            // returns Bad Request code if postQuery fails
            if (result instanceof Error) {
                console.log(new Error(`postQuery.post threw an error: ${result}`));
            }
        });

        return next();
    };
}
