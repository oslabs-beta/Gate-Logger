import axios from 'axios';
import { LogQueryData } from '../../@types/log';

// returns the result
export default async function postQuery(
    gateURI: string,
    projectID: string,
    queryData: LogQueryData
): Promise<void | Error> {
    // needs depth property once added into limiter functionality
    const { complexity, tokens, success, timestamp, loggedOn, latency, requestIP } = queryData;

    // most likely redundant, in place for strange edge cases
    if (
        (complexity && complexity < 0) ||
        timestamp < 0 ||
        tokens < 0 ||
        loggedOn < 0 ||
        (latency && latency < 0)
    )
        throw new SyntaxError(`[gatelog] Query data cannot be negative\n`);

    // returns false to signal index to send back 400 status code
    if (!success && complexity)
        throw new SyntaxError(
            `[gatelog] Complexity should be undefined when query is blocked by limiter\n`
        );

    // TEMP: depth is random until added onto limiter middleware
    const depth = Math.round(Math.random() * 10);

    const variables = {
        projectQuery: {
            requestIP,
            projectID,
            complexity,
            depth,
            tokens,
            success,
            timestamp,
            loggedOn,
            latency,
        },
    };

    // graphQL query
    const query = `
        mutation CreateProjectQuery($projectQuery: CreateProjectQueryInput!) {
            createProjectQuery(projectQuery: $projectQuery) {
                requestIP
                projectID
                complexity
                depth
                tokens
                success
                timestamp
                loggedOn
                latency
            }
        }
    `;

    const data = {
        query,
        variables,
    };

    // axios post request to the webapp's backend
    const result = await axios
        .post(`${gateURI}/gql`, data)
        .then((json) => json.data.data.createProjectQuery)
        .catch((err: Error): Error => {
            throw new Error(
                `[gatelog] Error posting project query\n${JSON.stringify(err, null, 2)}`
            );
        });

    // check in place to make sure query is posted to the correct project,
    // fails without crashing the server
    if (result?.projectID !== projectID) {
        throw new Error(
            `[gatelog] GraphQL error, resulting query's projectID does not match the ID entered\n`
        );
    }

    // returns project query object
    return result;
}
