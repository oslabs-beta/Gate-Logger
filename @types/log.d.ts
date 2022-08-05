// represents query data stored by limiter into res.locals.graphqlGate
export type LimQueryData = {
    // removed depth until functionality is added into limiter
    // depth?: number;
    complexity?: number;
    tokens: number;
    success: boolean;
};

// represents query data once passed through the logger
export type LogQueryData = {
    // removed depth until functionality is added into limiter
    // depth?: number;
    complexity?: number;
    tokens: number;
    success: boolean;
    timestamp: number;
    loggedOn: number;
    latency?: number;
    requestIP: string;
};
