import { MockServer, Route } from "dmock-server";
import { DatabaseCreationParameters } from "../../types/parameters/database";
import { DatabaseResponse } from "../../types/responses/database";

class APIMock {
    /**
     * 
     * const client = new CloudAPISDK({
    protocol: 'http',
    domain: `${cliArguments.ENVIRONMENT}:${cliArguments.PORT}`,
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    debug: true
});
     */
    protocol = 'http';
    domain = 'mock.com';
    accessKey = 'auth-access-key';
    secretKey = 'auth-secret-key';
    debug = true

    serverMocks: Route[] = []
    server: MockServer
    constructor(public host: string, public port: number) {
        this.domain = `${host}:${port}`;
        this.server = new MockServer({
            hostname: this.host,
            port: this.port,
            routes: this.serverMocks
        })
    }

    start() {
        this.server.start();
    }

    reload() {
        this.stop();
        this.server = new MockServer({
            hostname: this.host,
            port: this.port,
            routes: this.serverMocks
        })
        this.start();
    }

    stop() {
        this.server.stop();
    }

    addMockToPull(mock: Route) {
        this.serverMocks.push(mock);
    }

    generateCreateDatabaseMock(parameters: DatabaseCreationParameters): Route[] {
        const finalParams = Object.assign(CREATE_DATABASE_MOCK, parameters);
    }
}

const CREATE_DATABASE_MOCK: DatabaseCreationParameters = {
    name: 'default-db',
    protocol: 'redis',
    memoryLimitInGb: 1
}

const RESPONSE_DATABSE_MOCK: DatabaseResponse = {
    databaseId: -1,
    name: string,
    protocol: DatabaseProtocol,
    provider: DatabaseProvider,
    region: string,
    redisVersionCompliance: string,
    status: DatabaseStatus,
    memoryLimitInGb: number,
    memoryUsedInMb: number,
    memoryStorage: DatabaseMemoryStorage,
    supportOSSClusterApi: boolean,
    dataPersistence: DatabaseDataPersistence,
    replication: boolean,
    privateEndpoint: string,
    publicEndpoint: string,
    dataEvictionPolicy: DatabaseDataEvictionPolicy,
    throughputMeasurement: DatabaseThroughputMeasurement,
    replicaOf: DatabaseReplicaOfEndpoints,
    clustering: DatabaseClustering,
    security: DatabaseSecurity,
    modules: [],
    alerts: [],
}