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
        const { complexity, timestamp, tokens } = this.queryData;

        // default until depth is added onto limiter middleware
        const depth = -1;

        const headers = {
            'content-type': 'application/json',
        };

        // expecting variables to have projectID, complexity, depth, & timestamp properties
        const variables = {
            complexity,
            depth,
            timestamp,
            projectID: this.projectID,
        };

        const graphqlQuery = {
            operationName: 'CreateProjectQuery',
            query: `mutation CreateProjectQuery($projectQuery: CreateProjectQueryInput!) {
                        createProjectQuery(projectQuery: $projectQuery) {
                            number
                            projectID
                            complexity
                            depth
                            tokens
                            timestamp
                        }
                    }`,
            variables: { projectQuery: variables },
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(graphqlQuery),
        };

        try {
            await axios(`${this.gateURI}/gql`, options);
        } catch (error) {
            return `[gatelog] Error posting query to webapp ${error}`;
        }
    }
}
