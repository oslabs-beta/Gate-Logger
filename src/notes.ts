// res.locals -> graphqlGate -> timestamp (ms), complexity, tokens

// throw an error if res.locals.graphqlGate

// wrapper around limiter?

// app.use(logger(PROJECT, key))

// logger func: save query

// var x = res.send;
// var y = ()=>{} -> send req to db, log query data, then invoke x, reference graphqlGate
// res.send = y;

// app.use(rateLimiter) -> res.locals.graphqlGate

// resolver: return data; return res.send(data);
// does GQL use res.send? res.json?

// look into all res.send types in express, and if gql uses any/all of these;

// OR

// app.use(logger(ratelimiter))
// app.use(logger) pre (latency start)
// limiter
// logger post

// limiter send

export {};
