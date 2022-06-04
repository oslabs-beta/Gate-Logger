import { Request, Response, NextFunction } from 'express';

// import AuthVerification from './middleware/AuthVerification';
// import PostQuery from './middleware/PostQuery';

// URI pointing to the visual webapp
const gateURI = 'http://localhost:3000';

/**
 * @function gateLog runs along with the helper functions
 * first, authorizes the user's request to post to the webapp
 * using params. This middleware should be imstantiated below
 * the rate limiter.
 *
 * e.g. app.use(gatelimiter(params...))
 *      app.use(gatelog(params...))
 *
 *
 * @param projectID points to the user's project in the webapp backend
 *
 * @param apiKey the authorization code the user provides to post
 *               to the webapp's backend
 *
 */
// instantation, everything before the return callback runs only once
export default function gatelog(projectID: string, apiKey: string) {
    // const newAuth = new AuthVerification(gateURI, projectID, apiKey);

    // const validate = newAuth.endpointValidation(req, res, next);
    // const verify = newAuth.keyVerification(req, res, next);

    // run the API Key verification process when gateLogger is instantiated
    try {
        // await validate();
        // await verify();
    } catch (err) {
        return err;
    }

    // const postQuery = new PostQuery(gateURI, projectID);

    // every time a request is processed in the user's backend
    // eslint-disable-next-line arrow-body-style
    return async (req: Request, res: Response, next: NextFunction) => {
        // postQuery.post(req, res, next);

        return next();
    };
}
