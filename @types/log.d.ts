export type QueryData = {
    // removed depth until functionality is added into limiter
    // depth: number;
    complexity: number;
    tokens: number;
    success: boolean;
    timestamp: number;
    logged_on?: number;
    latency?: number;
};
