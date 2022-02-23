import { ifError } from "assert";
import { DatabaseClustering, DatabaseDataEvictionPolicy, DatabaseDataPersistence, DatabaseMemoryStorage, DatabaseProtocol, DatabaseProvider, DatabaseReplicaOfEndpoints, DatabaseResponse, DatabaseSecurity, DatabaseStatus, DatabaseThroughputMeasurement, DatabaseThroughputMeasurementType } from "../../types/responses/database";

export class DatabaseParser {

    private _databaseId: number = 0;
    private _name: string = 'temp-db-name';
    private _protocol: DatabaseProtocol = 'redis';
    private _provider: DatabaseProvider = 'AWS';
    private _region = '';
    private _redisVersionCompliance = '';
    private _status: DatabaseStatus = 'draft';
    private _memoryLimitInGb = 1;
    private _memoryUsedInMb = 0;
    private _memoryStorage: DatabaseMemoryStorage = 'ram';
    private _supportOSSClusterApi = false;
    private _dataPersistence: DatabaseDataPersistence = 'none';
    private _replication = true;
    private _privateEndpoint = 'private.cluster.com';
    private _publicEndpoint = 'public.cluster.com';
    private _dataEvictionPolicy: DatabaseDataEvictionPolicy = 'noeviction';
    private _throughputMeasurement: DatabaseThroughputMeasurement = {
        by: 'number-of-shards',
        value: 2
    }
    private _replicaOf: DatabaseReplicaOfEndpoints = { endpoints: [] };
    private _clustering: DatabaseClustering = {
        hashingPolicy: []
    }
    private _security: DatabaseSecurity = {
        password: 'fake-pass',
        sslClientAuthentication: false,
        sourceIps: []
    }
    private _modules = []
    private _alerts = []

    constructor(database: DatabaseResponse) {
        if(database) {
            this.load(database);
        }
    }

    
    public load(database: DatabaseResponse) {
        if(database.databaseId) { this.databaseId = database.databaseId; }
        if(database.name) { this.name = database.name };
        if(database.protocol) { this.protocol = database.protocol; }
    }

    public get databaseId() {
        return this._databaseId;
    }

    public set databaseId(id: number) {
        this._databaseId = id;
    }

    public get name() {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get protocol() {
        return this._protocol;
    }

    public set protocol(protocol: DatabaseProtocol) {
        this._protocol = protocol;
    }

    public get provider() {
        return this._provider;
    }

    public set provider(provider: DatabaseProvider) {
        this._provider = provider;
    }

    public get region() {
        return this._region;
    }

    public set region(region: string) {
        this._region = region;
    }

    public get redisVersionCompliance() {
        return this._redisVersionCompliance;
    }

    public set redisVersionCompliance(version: string) {
        this._redisVersionCompliance = version;
    }

    public get status() {
        return this._status;
    }

    public set status(status: DatabaseStatus) {
        this._status = status;
    }

    public get memoryLimitInGb() {
        return this._memoryLimitInGb;
    }

    public set memoryLimitInGb(limit: number) {
        this._memoryLimitInGb = limit;
    }

    public get memoryUsedInMb() {
        return this._memoryUsedInMb;
    }
    
    public set memoryUsedInMb(memory: number) {
        this._memoryUsedInMb = memory;
    }
    
    public get memoryStorage() {
        return this._memoryStorage;
    }

    public set memoryStorage(memory: DatabaseMemoryStorage) {
        this._memoryStorage = memory;
    }

    public get supportOSSClusterApi() {
        return this._supportOSSClusterApi;
    }

    public set supportOSSClusterApi(enable: boolean) {
        this._supportOSSClusterApi = enable;
    }

    public get dataPersistence() {
        return this._dataPersistence;
    }

    public set dataPersistence(dp: DatabaseDataPersistence) {
        this._dataPersistence = dp;
    }

    public get replication() {
        return this._replication;
    }

    public set replication(replication: boolean) {
        this._replication = replication;
    }

    public get privateEndpoint() {
        return this._privateEndpoint;
    }

    public set privateEndpoint(endpoint: string) {
        this._privateEndpoint = endpoint;
    }

    public get publicEndpoint() {
        return this._publicEndpoint;
    }

    public set publicEndpoint(endpoint: string) {
        this._publicEndpoint = endpoint;
    }

    public get dataEvictionPolicy() {
        return this._dataEvictionPolicy;
    }

    public set dataEvictionPolicy(policy: DatabaseDataEvictionPolicy) {
        this._dataEvictionPolicy = policy;
    }

    public get throughputMeasurementType() {
        return this._throughputMeasurement.by;
    }

    public set setThroughputMeasurementType(type: DatabaseThroughputMeasurementType) {
        this._throughputMeasurement.by = type;
    }

    public get throughputMeasurementValue() {
        return this._throughputMeasurement.value;
    }

    public set throughputMeasurementValue(value: number) {
        this._throughputMeasurement.value = value;
    }

    public get replicaOfEndpoints() {
        return this._replicaOf.endpoints;
    }

    public set replicaOfEndpoints(endpoints: string | string[]) {
        if(Array.isArray(endpoints)) {
            this._replicaOf.endpoints = endpoints;
        }
        else if(typeof endpoints === 'string') {
            this._replicaOf.endpoints.push(endpoints);
        }
    }

    public get hashingPolicy() {
        return this._clustering.hashingPolicy;
    }

    public set hashingPolicy(hashingPolicy: any | any[]) {
        if(Array.isArray(hashingPolicy)) {
            this._clustering.hashingPolicy = hashingPolicy;
        }
        else if(typeof hashingPolicy === 'string') {
            this._clustering.hashingPolicy.push(hashingPolicy);
        }
    }

    public get regexRules() {
        if(!this._clustering.regexRules) {
            return [];
        }
        else {
            return this._clustering.regexRules;
        }
    }

    public set regexRules(regexRules: any[] | any) {
        if(!this._clustering.regexRules) {
            this._clustering.regexRules = regexRules;
        }
        else if(Array.isArray(this._clustering.regexRules)) {
            this._clustering.regexRules.push(this._clustering.regexRules);
        }
    }

    

    /**
     * provider: DatabaseProvider;
     * region: string;
     * redisVersionCompliance: string;
     * status: DatabaseStatus;
     * memoryLimitInGb: number;
     * memoryUsedInMb: number;
     * memoryStorage: DatabaseMemoryStorage;
     * supportOSSClusterApi: boolean;
     * dataPersistence: DatabaseDataPersistence;
     * replication: boolean,
     * privateEndpoint: string,
     * publicEndpoint: string,
     * dataEvictionPolicy: DatabaseDataEvictionPolicy,
     * throughputMeasurement: DatabaseThroughputMeasurement,
     * replicaOf: DatabaseReplicaOfEndpoints,
     * clustering: DatabaseClustering,
     * security: DatabaseSecurity,
     * modules: DatabaseModule[],
     * alerts: any[],
     */
}