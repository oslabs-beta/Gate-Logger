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

    // passed in through req.query
    private projectID: string;

    // passed in through req.headers
    private logKey: string;

    constructor(gateURI: string, projectID: string, logKey: string) {
        this.gateURI = gateURI;
        this.projectID = projectID;
        this.logKey = logKey;
    }

    // Validates format of API requests
    // eslint-disable-next-line class-methods-use-this
    public async endpointValidation(req: Request, res: Response, next: NextFunction) {
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
        // if project query is the wrong length: ?project=[projectID] is required
        if (this.projectID?.length !== 24)
            throw new SyntaxError('[Log API] Project ID in endpoint query is missing or invalid');

        // if provided log_key length is wrong
        if (this.logKey?.length !== 10) {
            throw new SyntaxError(
                '[Log API] Log_key header is an incorrect length, must be 10 characters.'
            );
        }

        // when user's format passes all the validation
        return next();
    }

    // Verifies key provided in header matches key in associated project's entry in DB
    public async keyVerification(req: Request, res: Response, next: NextFunction) {
        let dbKey: string | Error = '';

        // this endpoint returns the associated API key
        await axios(`${this.gateURI}/auth/${this.projectID}`)
            .then((data: any) => data?.json())
            .then((obj: any): string => (dbKey = obj?.key))
            .catch((err) => new Error(`[Log API] Communication error with Gateway backend ${err}`));

        // if received DB key's length is wrong
        if (dbKey.length !== 10) {
            throw new SyntaxError('[Log API] API key from DB is incorrect length.');
        }

        if (this.logKey !== dbKey) return res.sendStatus(403);
        // .send(
        //     'The log_key provided in headers does not match the key given for the project specified'
        // );

        return next();
    }
}
