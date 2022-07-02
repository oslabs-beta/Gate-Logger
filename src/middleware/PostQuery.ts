import axios from 'axios';
import { QueryData } from '../../@types/log';

export default async function postQuery(
    gateURI: string,
    projectID: string,
    queryData: QueryData
): Promise<void | Error> {
    // needs depth property once added into limiter functionality
    const { complexity, tokens, success, timestamp, loggedOn, latency } = queryData;

    // most likely redundant, merely in place to fight possible edge cases
    if (complexity < 0 || timestamp < 0 || tokens < 0)
        throw new SyntaxError(`[gatelog] Query data cannot be negative.`);

    // TEMP: depth is random until added onto limiter middleware
    const depth = Math.round(Math.random() * 10);

    const variables = {
        projectQuery: {
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
        .catch(
            (err: Error): Error =>
                new Error(`[gatelog] Error posting project query\n${JSON.stringify(err, null, 2)}`)
        );

    // check in place to make sure query is posted to the correct project
    if (result.projectID !== projectID)
        throw new Error(
            `[gatelog] GraphQL error, resulting query's projectID does not match the ID entered`
        );

    // returns project query object
    return result;
}
