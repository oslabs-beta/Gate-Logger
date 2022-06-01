import { Request, Response, NextFunction } from 'express';

/*
 *  This class will be for handling the transfer of the res.locals.graphqlGate object
 *  to the webapp's backend
 */

export default class PostQuery {
    private gateURI: string;

    constructor(gateURI: string) {
        this.gateURI = gateURI;
    }

    // takes data from res.locals.graphqlGate and posts to webapp backend
    public async post(req: Request, res: Response, next: NextFunction) {
        if (!res.locals.graphqlGate)
            throw new ReferenceError(
                `gate-logger must be in the middleware chain right before graphql-gate 
                \n ex. app.use(gate-logger())
                \n app.use(graphQL-gate())`
            );

        const { complexity, depth, timestamp: time } = res.locals.graphqlGate;

        const headers = {
            'content-type': 'application/json',
        };

        // expecting variables to have projectID, complexity, depth, & timestamp properties
        const variables = {
            complexity,
            depth,
            time,
            projectID: req.query.project,
        };

        const graphqlQuery = {
            operationName: 'CreateProjectQuery',
            query: `mutation CreateProjectQuery($projectQuery: CreateProjectQueryInput!) {
                        createProjectQuery(projectQuery: $projectQuery) {
                            number
                            projectID
                            complexity
                            depth
                            time
                        }
                    }`,
            variables: { projectQuery: variables },
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(graphqlQuery),
        };

        await fetch(`${this.gateURI}/gql`, options).catch(
            (err) => `Error posting query to Gateway Backend: ${err}`
        );

        return next();
    }
}
