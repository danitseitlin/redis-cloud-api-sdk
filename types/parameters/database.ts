import { DatabaseProtocol, DatabaseDataPersistence, DatabaseDataEvictionPolicy, DatabaseThroughputMeasurement, DatabaseImportSource } from '../responses/database';

/**
 * The parameters used to create a database
 * @param dryRun Optional. When 'false’: Creates a deployment plan and deploys it (creating any resources required by the plan). When 'true’: creates a read-only deployment plan without any resource creation. Default: ‘true’
 * @param name Required. Database name
 * @param protocol Optional. Database protocol: either ‘redis’ or 'memcached’. Default: ‘redis’
 * @param memoryLimitInGb Required. Maximum memory usage for this specific database
 * @param supportOSSClusterApi Optional. Support Redis open-source (OSS) Cluster API
 * @param useExternalEndpointForOSSClusterApi Optional. Should use external endpoint for open-source (OSS) Cluster API. Can only be enabled if OSS Cluster API support is enabled’. Default: ‘false’
 * @param dataPersistence Optional. Rate of database data persistence (in persistent storage)
 * @param dataEvictionPolicy Optional. Data items eviction method
 * @param replication Optional. Databases replication
 * @param throughputMeasurement Optional. The throughput measurement of the database
 * @param throughputMeasurement.by Required. Throughput measurement method. Either ‘number-of-shards’ or ‘operations-per-second’
 * @param throughputMeasurement.value Required. Throughput value (as applies to selected measurement method)
 * @param replicaOf Optional. This database will be a replica of the specified Redis databases provided as one or more URI (sample format: 'redis://user:password@host:port)'. If the URI provided is Redis Labs Cloud instance, only host and port should be provided (using the format: ['redis://endpoint1:6379’, ‘redis://endpoint2:6380’] ).
 * @param periodicBackupPath Optional. If specified, database will be able to perform backups to this path. If empty string is received, backup path will be removed
 * @param sourceIp Optional. List of source IP addresses or subnet masks. If specified, Redis clients will be able to connect to this database only from within the specified source IP addresses ranges (example: ['192.168.10.0/32’, ‘192.168.12.0/24’] )
 * @param clientSslCertificate Optional. If specified, this SSL certificate will be required to authenticate user connections. If empty string is received, SSL certificate will be removed
 * @param password Optional. If specified, this password will be used to access the database
 * @param alerts Optional. Redis Labs database alerts
 * @param averageItemSizeInBytes Optional. Relevant only to ram-and-flash subscriptions. Estimated average size (measured in bytes) of the items stored in the database, Default: 1000
 * @param modules Optional. Redis Labs modules to be provisioned in the database
  */
export type DatabaseCreationParameters = {
    dryRun?: boolean,
    name: string,
    protocol?: DatabaseProtocol,
    memoryLimitInGb: number,
    supportOSSClusterApi?: boolean,
    useExternalEndpointForOSSClusterApi?: boolean,
    dataPersistence?: DatabaseDataPersistence,
    dataEvictionPolicy?: DatabaseDataEvictionPolicy,
    replication?: boolean,
    throughputMeasurement?: DatabaseThroughputMeasurement,
    averageItemSizeInBytes?: number,
    replicaOf?: string[],
    periodicBackupPath?: string,
    sourceIp?: string[],
    clientSslCertificate?: string,
    password?: string,
    alerts?: Alert[],
    modules?: Module[]
}

/**
 * The parameters used to update an existing database
 * @param dryRun Optional. When 'false’: Creates a deployment plan and deploys it (creating any resources required by the plan). When 'true’: creates a read-only deployment plan without any resource creation. Default: ‘true’
 * @param name Optional. Database name
 * @param memoryLimitInGb Optional. Maximum memory usage for this specific database
 * @param supportOSSClusterApi Optional. Support Redis open-source (OSS) Cluster API
 * @param useExternalEndpointForOSSClusterApi Optional. Should use external endpoint for open-source (OSS) Cluster API. Can only be enabled if OSS Cluster API support is enabled’. Default: ‘false’
 * @param dataPersistence Optional. Rate of database data persistence (in persistent storage)
 * @param dataEvictionPolicy Optional. Data items eviction method
 * @param replication Optional. Databases replication
 * @param throughputMeasurement Optional. The throughput measurement of the database
 * @param throughputMeasurement.by Required. Throughput measurement method. Either ‘number-of-shards’ or ‘operations-per-second’
 * @param throughputMeasurement.value Required. Throughput value (as applies to selected measurement method)
 * @param replicaOf Optional. This database will be a replica of the specified Redis databases provided as one or more URI (sample format: 'redis://user:password@host:port)'. If the URI provided is Redis Labs Cloud instance, only host and port should be provided (using the format: ['redis://endpoint1:6379’, ‘redis://endpoint2:6380’] ).
 * @param periodicBackupPath Optional. If specified, database will be able to perform backups to this path. If empty string is received, backup path will be removed
 * @param sourceIp Optional. List of source IP addresses or subnet masks. If specified, Redis clients will be able to connect to this database only from within the specified source IP addresses ranges (example: ['192.168.10.0/32’, ‘192.168.12.0/24’] )
 * @param clientSslCertificate Optional. If specified, this SSL certificate will be required to authenticate user connections. If empty string is received, SSL certificate will be removed
 * @param password Optional. If specified, this password will be used to access the database
 * @param alerts Optional. Redis Labs database alerts
 * @param regexRules Optional. Shard regex rules. Relevant only for a sharded database
 */
export type DatabaseUpdateParameters = { 
    dryRun?: boolean,
    name?: string,
    memoryLimitInGb?: number,
    supportOSSClusterApi?: boolean,
    useExternalEndpointForOSSClusterApi?: boolean,
    dataPersistence?: DatabaseDataPersistence,
    dataEvictionPolicy?: DatabaseDataEvictionPolicy,
    replication?: boolean,
    throughputMeasurement?: DatabaseThroughputMeasurement,
    replicaOf?: string[],
    periodicBackupPath?: string,
    sourceIp?: string[],
    clientSslCertificate?: string,
    password?: string,
    alerts?: Alert[],
    regexRules?: string[]
}


/**
 * The database alert
 * @param name The name of the alert
 * @param value The value of the alert
 */
export type Alert = {
    name: AlertName,
    value: string
}

/**
 * The alert names
 */
export type AlertName = 'dataset-size' | 'throughput-higher-than' | 'throughput-lower-than' | 'latency' | 'syncsource-error' | 'syncsource-lag';

/**
 * The database module
 * @param name Required. The name of the database module.
 * @param parameters Optional Redis Labs database module parameters (name and value), as relevant to the specific module (see modules parameters specification)
 */
export type Module = {
    name: DatabaseModule,
    parameters?: {[key: string]: any}
}

/**
 * The available database modules by name
 * @param RedisBloom The Redis Bloom module
 * @param RedisGraph The Redis Graph module
 * @param RedisJSON The Redis JSON module
 * @param RediSearch The Redis Search module
 * @param RedisTimeSeries The Redis Time Series module
 */
type DatabaseModule = 'RedisBloom' | 'RedisGraph' | 'RedisJSON' | 'RediSearch' | 'RedisTimeSeries'

/**
 * The parameters needed to import a database file into an existing database
 * @param sourceType Required. Type of storage source from which to import the database file (RDB files) or data (Redis connection)
 * @param importFromUri Required. One or more URIs to source data files or Redis databases, as appropriate to specified source type (example: ['http://mydomain.com/redis-backup-file1’, ‘http://mydomain.com/redis-backup-file2’])
 */
export type DatabaseImportParameters = {
    sourceType: DatabaseImportSource,
    importFromUri: string[]
}