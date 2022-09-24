import { ifError } from "assert";
import { DatabaseModule } from "../../types/parameters/database";
import { DatabaseAlertResponse, DatabaseClustering, DatabaseDataEvictionPolicy, DatabaseDataPersistence, DatabaseMemoryStorage, DatabaseProtocol, DatabaseProvider, DatabaseReplicaOfEndpoints, DatabaseResponse, DatabaseSecurity, DatabaseStatus, DatabaseThroughputMeasurement, DatabaseThroughputMeasurementType } from "../../types/responses/database";
import { DatabaseModuleInformation } from "../../types/responses/general";

export class DatabaseParser {

    private _databaseId: number = -1;
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
    private _modules: DatabaseModuleInformation[] = []
    private _alerts: DatabaseAlertResponse[] = []

    constructor(database?: DatabaseResponse) {
        if(database) {
            this.load(database);
        }
    }

    public load(database: DatabaseResponse) {
        for(const prop in this) {
            if(database[prop]) {
                this[prop] = database[prop] as any
            }
        }
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

    public get password() {
        return this._security.password;
    }

    public set password(password: string) {
        this._security.password = password;
    }

    public get sslClientAuthentication() {
        return this._security.sslClientAuthentication;
    }

    public set sslClientAuthentication(isEnabled: boolean) {
        this._security.sslClientAuthentication = isEnabled;
    }

    public get sourceIps() {
        return this._security.sourceIps;
    }

    public set sourceIps(ips: string[] | string) {
        if(Array.isArray(ips)) {
            this._security.sourceIps = ips;
        }
        else if (typeof ips === 'string') {
            this._security.sourceIps.push(ips);
        }
    }

    public get enableTls() {
        return this._security.enableTls ?? false;
    }

    public set enableTls(isEnabled: boolean) {
        this._security.enableTls = isEnabled;
    }

    public get modules(): DatabaseModuleInformation[] {
        return this._modules;
    }

    public set modules(modulesList: DatabaseModuleInformation[] | DatabaseModuleInformation) {
        if(Array.isArray(modulesList)) {
            this._modules = modulesList as DatabaseModuleInformation[];
        }
        else if(typeof modulesList === 'string') {
            this._modules.push(modulesList)
        }
    }

    public get alerts() {
        return this._alerts;
    }

    public set alerts(alerts: any | any[]) {
        if(Array.isArray(alerts)) {
            this._alerts = alerts;
        }
        else {
            this._alerts.push(alerts)
        }
    }

    toJSON(): DatabaseResponse {
        return {
            databaseId: this.databaseId,
            name: this.name,
            protocol: this.protocol,
            memoryStorage: this.memoryStorage,
            provider: this.provider,
            region: this.region,
            redisVersionCompliance: this.redisVersionCompliance,
            status: this.status,
            memoryLimitInGb: this.memoryLimitInGb,
            memoryUsedInMb: this.memoryUsedInMb,
            supportOSSClusterApi: this.supportOSSClusterApi,
            dataPersistence: this.dataPersistence,
            replication: this.replication,
            privateEndpoint: this.privateEndpoint,
            publicEndpoint: this.publicEndpoint,
            dataEvictionPolicy: this.dataEvictionPolicy,
            throughputMeasurement: this._throughputMeasurement,
            replicaOf: this._replicaOf,
            clustering: { hashingPolicy: this.hashingPolicy },
            security: this._security,
            modules: this.modules,
            alerts: this.alerts
        }
    }
    public toString() {
        return JSON.stringify(this.toJSON());
    }
}

/***
 * 
    private _replicaOf: DatabaseReplicaOfEndpoints = { endpoints: [] };
    private _clustering: DatabaseClustering = {
        hashingPolicy: []
    }
    private _security: DatabaseSecurity = {
        password: 'fake-pass',
        sslClientAuthentication: false,
        sourceIps: []
    }
    private _modules: DatabaseModule[] = []
    private _alerts: DatabaseAlertResponse[] = []
 * 
 * 
 */