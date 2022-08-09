<div align="center">
   <img width="50px" src="https://user-images.githubusercontent.com/89324687/182067950-54c00964-2be4-481a-976b-773d9112a4c0.png"/>
   <h1>Gate Logger</h1>
   <a href="https://github.com/oslabs-beta/Gate-Logger"><img src="https://img.shields.io/badge/license-MIT-blue"/></a> <a href="https://github.com/oslabs-beta/Gate-Logger/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/oslabs-beta/Gate-Logger"></a> <a             href="https://github.com/oslabs-beta/Gate-Logger/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/oslabs-beta/Gate-Logger"></a> <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/Gate-Logger">

   <h3 align="center"> <strong>The data pipeline package for communication between the GraphQLGate Rate-Limiter and your Gateway developer portal.</strong></h3>
   </div>
   
&nbsp;

## <a name="prerequisites"></a> Prerequisites

This package interfaces with the GraphQLGate rate-limiting package to log query data for visualization in the Gateway developer portal

1. Signup/login to the [Gateway developer portal](graphqlgate.io).

2. Create a new project to recieve a project ID and API key.

3. Import and configure the [GraphQLGate rate-limiting package](https://www.npmjs.com/package/graphqlgate)

## <a name="getting-started"></a> Getting Started

Install the package

```
npm i gate-logger
```

Import the package and add the logging middleware to the Express middleware chain BEFORE the GraphQLGate middleware.

** ERRORS WILL BE THROWN if the logger is added after the limiter **

Copy the project ID and the API key from your project on the Gateway developer portal and include them as middleware arguments.

```javascript
// import package
import gateLogger from 'gate-logger';
import { expressGraphQLRateLimiter } from 'graphql-limiter';

/**
 * Import other dependencies
 * */

// Add the logger middleware into your GraphQL middleware chain
app.use('gql', gateLogger(/* PROJECT ID */, /* API KEY */ );

//Add the rate limiting middleware
app.use(
    'gql',
    expressGraphQLRateLimiter(schemaObject, {
        rateLimiter: {
            type: 'TOKEN_BUCKET',
            refillRate: 10,
            capacity: 100,
        },
    }) /** add GraphQL server here */
);
```

And that's it! The logger will now send all query rate-limiting data, blocked or allowed, for you to view in the Gateway developer portal!
