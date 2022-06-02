import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

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
    public async endpointValidation(req: Request, res: Response, next: NextFunction) {
        const { project } = req.query;

        // if the gate URI responds with a bad status code, throw an error
        await axios(this.gateURI)
            .then((response) => {
                if (response.status >= 400)
                    throw new SyntaxError('[Log API] Invalid Gateway URL provided');
            })
            // throws error if server is not running
            .catch((err) => new Error(`[Log API] Server not running ${err}`));

        // if endpoint is invalid: /log is required
        if (!req.path || !req.path?.includes('log')) {
            throw new SyntaxError(
                '[Log API] Endpoint in your request is invalid, format must be: /log?project=[projectID]'
            );
        }
        // if project query is missing or the wrong length: ?project=[projectID] is required
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
            dbKey = await axios(`${this.gateURI}/auth/${projectID}`)
                .then((data: any) => data?.key)
                // .then((obj: any): any => obj?.key);
                .catch(
                    (err) => new Error(`[Log API] Communication error with Gateway backend ${err}`)
                );
        } else throw new Error(`[Log API] Webapp backend URI not specified`);

        if (key !== dbKey)
            return res
                .sendStatus(403)
                .send(
                    'The log_key provided in headers does not match the key given for the project specified'
                );

        return next();
    }
}
