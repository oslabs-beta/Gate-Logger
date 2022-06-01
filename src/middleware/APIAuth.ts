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
 */
import { Request, Response, NextFunction } from 'express';

export default class AuthVerification {
    // Validates format of API requests

    public static endpointValidation(req: Request, res: Response, next: NextFunction) {
        const { project } = req.query;

        // simplistic ID validation
        if (project?.length !== 24) throw new Error('[Log API] URL invalid, check project ID');

        // if endpoint and IDs are valid
        if (req.path.includes('log') && req.headers.log_key?.length === 10) {
            return next();
        }

        throw new Error('[Log API] Endpoint and/or log_key header invalid');
    }

    // Verifies key provided in header matches key in associated project's entry in DB
    public static async keyVerification(req: Request, res: Response, next: NextFunction) {
        const { log_key: key } = req.headers;
        const { project: projectID } = req.query;

        /*
         *
         *
         * URI to gate web app must be included (once operational)
         */
        const gateURI = '';
        const dbKey = await fetch(`${gateURI}/auth/${projectID}`).then((data): string =>
            data.toString()
        );

        if (key !== dbKey)
            throw new Error('[Log API] Header log_key incorrect, check key and project ID');

        return next();
    }
}
