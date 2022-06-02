import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';

/*
 *   This class contains express middleware for endpoints with the following format:
 *       /log?project=[projectID]
 *
 *   The request must have the header 'log_key' with a 10-character
 *   string value. This middleware will be to validate the key based on
 *   the user specified in the endpoint's stored key in the DB.
 *
 *   This method will only be secure once the endpoints established in the
 *   web app backend are protected.
 *
 *   Constructor args must include the URI to the webapp,
 *   during development it is localhost:3000
 */
export default class AuthVerification {
    private gateURI: string;

    constructor(gateURI: string) {
        this.gateURI = gateURI;
    }

    // Validates format of API requests
    // eslint-disable-next-line class-methods-use-this
    public endpointValidation(req: Request, res: Response, next: NextFunction) {
        const { project } = req.query;

        // if endpoint is invalid
        if (!req.path.includes('log')) {
            throw new SyntaxError(
                '[Log API] Endpoint in your request is invalid,\nformat must be: /log?project=[projectID]'
            );
        }
        // simplistic ID validation
        if (!project || project?.length !== 24)
            throw new SyntaxError('[Log API] Project ID in endpoint query is missing or invalid');

        // if log_key is missing from headers or its length is wrong
        if (!req.headers.log_key || req.headers.log_key?.length !== 10) {
            throw new SyntaxError('[Log API] Log_key header is missing or an incorrect length');
        }

        // when user's format passes all the validation
        return next();
    }

    // Verifies key provided in header matches key in associated project's entry in DB
    public async keyVerification(req: Request, res: Response, next: NextFunction) {
        const { log_key: key } = req.headers;
        const { project: projectID } = req.query;

        let dbKey = '';

        if (this.gateURI) {
            // this endpoint returns the associated API key
            dbKey = await fetch(`${this.gateURI}/auth/${projectID}`)
                .then((data) => data.json())
                .then((obj) => obj.key);
        } else throw new Error(`Webapp backend URI not specified`);

        if (key !== dbKey)
            throw new Error('[Log API] Header log_key incorrect, check key and project ID');

        return next();
    }
}
