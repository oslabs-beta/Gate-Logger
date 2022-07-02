import { Request, Response, NextFunction } from 'express';

import AuthVerification from './middleware/APIAuth';
import postQuery from './middleware/PostQuery';

// URI pointing to the visual webapp
const gateURI = 'http://localhost:3000';

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
export default async function gatelog(projectID: string, apiKey: string) {
    const newAuth = new AuthVerification(gateURI, projectID, apiKey);

    const validate = newAuth.validation;
    const verify = newAuth.verification;

    // run the API Key verification process when gatelog is instantiated
    const isValidated: boolean | Error = await validate().catch((err) => err);
    const isVerified: boolean | Error = await verify().catch((err) => err);

    if (isValidated !== true || isVerified !== true)
        return new SyntaxError(
            `[gatelog] Error thrown dealing with the project ID and/or the API key entered\n`
        );

    // every time a request is processed in the user's backend,
    // this express middleware callback will run
    return (req: Request, res: Response, next: NextFunction) => {
        // calls initial timestamp of request's beginning,
        // this will depend on where logger is placed in middleware chain
        const timestamp: number = new Date().valueOf();

        // runs logger's functionality upon response being sent back to client
        res.on('finish', async (): Promise<void> => {
            // calls timestamp of request's end
            const loggedOn: number = new Date().valueOf();

            // stores time between request's beginning and end
            const latency: number = loggedOn - timestamp;

            await postQuery(gateURI, projectID, {
                ...res.locals.graphqlGate,
                timestamp,
                loggedOn,
                latency,
            }).catch((err) => console.log(`postQuery.post threw an error: ${err}`));
        });

        return next();
    };
}
