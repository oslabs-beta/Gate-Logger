import axios from 'axios';

/**
 *  This class will be for handling the transfer of the res.locals.graphqlGate object
 *  to the webapp's backend
 */
export default class PostQuery {
    // address to our webapp's backend, currently sits at localhost:3000
    private gateURI: string;

    // points to user's project in our webapp DB
    private projectID: string;

    // passed in by our logger middleware from res.locals.graphqlGate
    private queryData: QueryData;

    constructor(gateURI: string, projectID: string, queryData: QueryData) {
        this.gateURI = gateURI;
        this.projectID = projectID;
        this.queryData = queryData;
    }

    // takes data from res.locals.graphqlGate and posts to webapp backend
    public async post() {
        const { complexity, timestamp, tokens, success } = this.queryData;

        if (complexity < 0 || timestamp < 0 || tokens < 0)
            throw new SyntaxError(`[gatelog] Query data cannot be negative.`);

        // default until depth is added onto limiter middleware
        const depth = -1;

        // expecting variables to have projectID, complexity, depth, & timestamp properties
        const variables = {
            projectID: this.projectID,
            complexity,
            depth,
            tokens,
            success,
            timestamp,
        };

        const query = `
            mutation CreateProjectQuery($projectQuery: CreateProjectQueryInput!) {
                createProjectQuery(projectQuery: $projectQuery) {
                    number
                    projectID
                    complexity
                    depth
                    tokens
                    success
                    timestamp
                }
            }
        `;

        const data = {
            query,
            variables: { projectQuery: variables },
        };

        const result = await axios
            .post(`${this.gateURI}/gql`, data)
            .then((json) => json.data.data.createProjectQuery.projectID)
            .catch(
                (err: Error): Error => new Error(`[gatelog] Error posting query to webapp ${err}`)
            );

        //
        if (result !== this.projectID)
            throw new Error(
                `[gatelog] GraphQL error, resulting query's projectID does not match the one entered`
            );

        return result;
    }
}
