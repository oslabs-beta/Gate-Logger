import { Request, Response, NextFunction } from 'express';

import AuthVerification from './middleware/APIAuth';
import PostQuery from './middleware/PostQuery';

// URI pointing to the visual webapp
const gateURI = 'http://localhost:3000';

/**
 * @function gateLog runs along with the helper functions
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
 * The gate log will be changing the definition of res.end (which is
 * called by res.json and res.send) to include the logger's functionality,
 * as well as the same functionality of res.end.
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

    // run the API Key verification process when gateLogger is instantiated
    try {
        await validate();
        await verify();
    } catch (err) {
        return err;
    }

    // every time a request is processed in the user's backend,
    // this express middleware callback will run
    return async (req: Request, res: Response, next: NextFunction) => {
        const postQuery = new PostQuery(gateURI, projectID, res.locals.graphqlGate);

        // reassign res.end in order to allow logger functionality before
        // a response is sent back the client

        // eslint-disable-next-line arrow-body-style
        res.end = () => {
            postQuery.post();
            return res;
        };

        return next();
    };
}
