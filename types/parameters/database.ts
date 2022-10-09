import { DatabaseProtocol, DatabaseDataPersistence, DatabaseDataEvictionPolicy, DatabaseThroughputMeasurement, DatabaseImportSource } from '../responses/database';

/**
 * The parameters used to create a database
 * @param dryRun Optional. When 'false’: Creates a deployment plan and deploys it (creating any resources required by the plan). When 'true’: creates a read-only deployment plan without any resource creation. Default: ‘true’
 * @param name Required. Database name
 * @param protocol Optional. Database protocol: either ‘redis’ or 'memcached’. Default: ‘redis’
 * @param customPort Optional. Database custom port.
 * @param memoryLimitInGb Required. Maximum memory usage for this specific database
 * @param supportOSSClusterApi Optional. Support Redis open-source (OSS) Cluster API
 * @param useExternalEndpointForOSSClusterApi Optional. Should use external endpoint for open-source (OSS) Cluster API. Can only be enabled if OSS Cluster API support is enabled’. Default: ‘false’
 * @param dataPersistence Optional. Rate of database data persistence (in persistent storage)
 * @param dataEvictionPolicy Optional. Data items eviction method
 * @param replication Optional. Databases replication
 * @param throughputMeasurement Optional. The throughput measurement of the database
 * @param throughputMeasurement.by Required. Throughput measurement method. Either ‘number-of-shards’ or ‘operations-per-second’
 * @param throughputMeasurement.value Required. Throughput value (as applies to selected measurement method)
 * @param replicaOf Optional. This database will be a replica of the specified Redis databases provided as one or more URI (sample format: 'redis://user:password@host:port)'. If the URI provided is Redis Cloud instance, only host and port should be provided (using the format: ['redis://endpoint1:6379’, ‘redis://endpoint2:6380’] ).
 * @param periodicBackupPath Optional. If specified, database will be able to perform backups to this path. If empty string is received, backup path will be removed
 * @param sourceIp Optional. List of source IP addresses or subnet masks. If specified, Redis clients will be able to connect to this database only from within the specified source IP addresses ranges (example: ['192.168.10.0/32’, ‘192.168.12.0/24’] )
 * @param enableTls Optional. When 'true’, requires TLS authentication for all connections (mTLS with valid clientSslCertificate, regular TLS when the clientSslCertificate is not provided)
 * @param clientSslCertificate Optional. If specified, this SSL certificate will be required to authenticate user connections. If empty string is received, SSL certificate will be removed
 * @param password Optional. If specified, this password will be used to access the database
 * @param alerts Optional. Redis database alerts
 * @param averageItemSizeInBytes Optional. Relevant only to ram-and-flash subscriptions. Estimated average size (measured in bytes) of the items stored in the database, Default: 1000
 * @param modules Optional. Redis modules to be provisioned in the database
  */
export type DatabaseCreationParameters = {
    dryRun?: boolean,
    name: string,
    protocol?: DatabaseProtocol,
    customPort?: number,
    memoryLimitInGb: number,
    supportOSSClusterApi?: boolean,
    useExternalEndpointForOSSClusterApi?: boolean,
    dataPersistence?: DatabaseDataPersistence,
    dataEvictionPolicy?: DatabaseDataEvictionPolicy,
    replication?: boolean,
    throughputMeasurement?: DatabaseThroughputMeasurement,
    localThroughputMeasurement?: LocalThroughputMeasurement[],
    averageItemSizeInBytes?: number,
    replicaOf?: string[],
    periodicBackupPath?: string,
    sourceIp?: string[],
    enableTls?: boolean,
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
 * @param replicaOf Optional. This database will be a replica of the specified Redis databases provided as one or more URI (sample format: 'redis://user:password@host:port)'. If the URI provided is Redis Cloud instance, only host and port should be provided (using the format: ['redis://endpoint1:6379’, ‘redis://endpoint2:6380’] ).
 * @param periodicBackupPath Optional. If specified, database will be able to perform backups to this path. If empty string is received, backup path will be removed
 * @param sourceIp Optional. List of source IP addresses or subnet masks. If specified, Redis clients will be able to connect to this database only from within the specified source IP addresses ranges (example: ['192.168.10.0/32’, ‘192.168.12.0/24’] )
 * @param enableTls Optional. When 'true’, requires TLS authentication for all connections (mTLS with valid clientSslCertificate, regular TLS when the clientSslCertificate is not provided)
 * @param clientSslCertificate Optional. If specified, this SSL certificate will be required to authenticate user connections. If empty string is received, SSL certificate will be removed
 * @param password Optional. If specified, this password will be used to access the database
 * @param alerts Optional. Redis database alerts
 * @param regexRules Optional. Shard regex rules. Relevant only for a sharded database
 * @param globalAlerts Optional. The Redis database alerts for all regions in AA subscription (For AA subscription only)
 * @param globalDataPersistence Optional. (For AA subscription only) 
 * @param globalPassword Optional. The Rate of database data persistence for all regions in AA subscription (For AA subscription only)
 * @param globalSourceIp Optional. List of source IP addresses or subnet masks for all regions in AA subscription (For AA subscription only)
 * @param regions Optional. The parameters for database in a specific region, used to override global AA settings (For AA subscription only)
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
    enableTls?: boolean,
    clientSslCertificate?: string,
    password?: string,
    alerts?: Alert[],
    regexRules?: string[],
    globalAlerts?: Alert[],
    globalDataPersistence?: DatabaseDataPersistence,
    globalPassword?: string,
    globalSourceIp?: string[],
    regions?: ActiveActiveDatabaseRegionParameters[]
}


/**
 * The database alert
 * @param name The name of the alert
 * @param value The value of the alert
 */
export type Alert = {
    name: AlertName,
    value: number
}

/**
 * The alert names
 */
export type AlertName = 'dataset-size' | 'throughput-higher-than' | 'throughput-lower-than' | 'latency' | 'syncsource-error' | 'syncsource-lag';

/**
 * The database module
 * @param name Required. The name of the database module.
 * @param parameters Optional Redis database module parameters (name and value), as relevant to the specific module (see modules parameters specification)
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

/**
 * The region name parameters
 * @param regionName The name of the region
 */
export type RegionName = {
    regionName: string
}

/**
 * The database backup parameters
 * @param active If to activate backup or not
 * @param interval The backup time interval
 * @param storagePath The path to store the backup files
 * @param storageType The backup destination type
 * @param timeUTC The time in UTC to backup the database
 */
export type DatabaseBackupParameters = {
    active?: boolean,
    interval?: DatabaseBackupInterval,
    storagePath?: string,
    storageType?: DatabaseBackupStorageType,
    timeUTC?: string
};

/**
 * The database backup interval options
 */
export type DatabaseBackupInterval = 'every-1-hours' | 'every-2-hours' | 'every-4-hours' | 'every-6-hours' | 'every-12-hours' | 'every-24-hours';

/**
 * The database backup storage options
 */
export type DatabaseBackupStorageType = 'aws-s3' | 'azure-blob-storage' | 'google-blob-storage' | 'ftp';

/**
 * The Local Throughput Measurement object
 * @param region The name of the region
 * @param writeOperationsPerSecond The writes/second speed
 * @param readOperationsPerSecond The reads/second speed
 */
export type LocalThroughputMeasurement = {
    region: string,
    writeOperationsPerSecond: number,
    readOperationsPerSecond: number
};

/**
 * The AA database information as returned by GET regions
 * @param databaseId The database ID
 * @param databaseName The database ID
 */
export type CrdbRegion = Pick<LocalThroughputMeasurement, 'readOperationsPerSecond' | 'writeOperationsPerSecond'> & {
    databaseId: number,
    databaseName: string
};

/**
 * The database object for create active-active region request
 * @param localThroughputMeasurement The Local Throughput Measurement object
 * @param name The name of the database
 */
export type CreateRegionActiveActiveDatabaseParameters = {
    localThroughputMeasurement: LocalThroughputMeasurement,
    name: string
};

/**
 * The region parameters for an Active Active database
 * @param region The region of the database
 * @param alerts Optional The alerts for the database of a specified region
 * @param dataPersistence Optional The data persistence for the database of a specified region
 * @param sourceIp Optional The source IPs for the database of a specified region
 * @param password Optional The password for the database of a specified region
 * @param remoteBackup Optional The backup parameters for the database of a specified region
 * @param localThroughputMeasurement Optional The local throughput measurement parameters for the database of a specified region
 */
export type ActiveActiveDatabaseRegionParameters = {
    region: string,
    alerts?: Alert[],
    dataPersistence?: DatabaseDataPersistence,
    sourceIp?: string[],
    password?: string,
    remoteBackup?: DatabaseBackupParameters,
    localThroughputMeasurement?: LocalThroughputMeasurement
};