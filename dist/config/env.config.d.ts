export declare const config: {
    port: number;
    nodeEnv: string;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cors: {
        origin: string;
    };
};
