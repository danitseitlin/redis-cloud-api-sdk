import { AlertName } from '../..';
import { DatabaseModule } from './general';

/**
 * The database response
 * @param databaseId The id of the database
 * @param protocol The protocol of the database
 * @param provider The provider of the database
 * @param region The region of the database
 * @param redisVersionCompliance The Redis version of the database
 * @param status The status of the database
 * @param memoryLimitInGb The memory limit of the database
 * @param memoryUsedInMb The memory used in the database
 * @param memoryStorage The memory storage type of the database
 * @param activeActiveRedis If the database is Active Active
 * @param activatedOn The time the database was created
 * @param lastModified The last time the database was modified
 * @param supportOSSClusterApi If the database supports oss cluster API
 * @param dataPersistence The data persistence of the database
 * @param replication If the database replication is enabled/disabled
 * @param privateEndpoint The private endpoint of the database
 * @param publicEndpoint The public endpoint of the database
 * @param dataEvictionPolicy The data eviction policy of the database
 * @param throughputMeasurement The throughput measurement of the database
 * @param replicaOf The replica of endpoints of the database
 * @param clustering The database clustering
 * @param security The database security
 * @param modules The database modules
 * @param alerts The database alerts
 */
export type DatabaseResponse = {
    databaseId: number,
    name: string,
    protocol: DatabaseProtocol,
    provider: DatabaseProvider,
    region: string,
    redisVersionCompliance: string,
    status: DatabaseStatus,
    memoryLimitInGb: number,
    memoryUsedInMb: number,
    memoryStorage: DatabaseMemoryStorage,
    activeActiveRedis?: boolean,
    activatedOn: string,
    lastModified: string,
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
    modules: DatabaseModule[],
    alerts: DatabaseAlert[],
    crdbDatabases?: CrdbDatabase[],
    [key: string]: any
}

/**
 * The database alert
 * @param id The ID of the alert
 * @param name The name of the alert
 * @param value The value of the alert
 * @param defaultValue The default value of the alert
 */
export type DatabaseAlert = {
    id: number,
    name: AlertName,
    value: number,
    defaultValue: number,
    [key: string]: any
}

/**
 * The database throughput measurement
 * @param by The type of throughput measurement
 * @param value The value of the throughput measurement
 */
export type DatabaseThroughputMeasurement = {
    by: 'number-of-shards' | 'operations-per-second',
    value: number,
    [key: string]: any
}

/**
 * The database security
 * @param password The database password
 * @param enableTls The TLS status
 * @param sslClientAuthentication The SSL client authentication
 * @param sourceIps The list of source IP's
 */
export type DatabaseSecurity = {
    password: string,
    enableTls?: boolean,
    sslClientAuthentication: boolean,
    sourceIps: string[],
    [key: string]: any
}

/**
 * The database clustering
 * @param numberOfShards The database number of shards
 * @param regexRules The database regex rules
 * @param hashingPolicy The database hashing policy
 */
export type DatabaseClustering = {
    numberOfShards?: number,
    regexRules?: any[],
    hashingPolicy: any[],
    [key: string]: any
}

/**
 * The database memory storage type
 * @param ram Redis on RAM
 * @param ram-and-flash Redis on Flash
 */
export type DatabaseMemoryStorage = 'ram' | 'ram-and-flash';

/**
 * The database provider
 * @param AWS Amazon Web Services
 * @param GCP Google Cloud Platform
 */
export type DatabaseProvider = 'AWS' | 'GCP';

/**
 * The database protocol types
 * @param redis Redis database protocol
 * @param memcached Memchached database protocol
 */
export type DatabaseProtocol = 'redis' | 'memcached';

/**
 * The database data persistence types
 * @param none No data persistence
 * @param aof-every-1-second AOF every second
 * @param aof-every-write AOF every write
 * @param snapshot-every-1-hour Snapshot every hour
 * @param snapshot-every-6-hours Snapshot every 6 hours
 * @param snapshot-every-12-hours Snapshot every 12 hours
 */
export type DatabaseDataPersistence = 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours';

/**
 * The database data eviction policy types
 * @param allkeys-lru allkeys-lru eviction policy
 * @param allkeys-lfu allkeys-lfu eviction policy
 * @param allkeys-random allkeys-random eviction policy
 * @param volatile-lru volatile-lru eviction policy
 * @param volatile-lfu volatile-lfu eviction policy
 * @param volatile-random volatile-random eviction policy
 * @param volatile-ttl volatile-ttl eviction policy
 * @param noeviction noeviction eviction policy
 */
export type DatabaseDataEvictionPolicy = 'allkeys-lru' | 'allkeys-lfu' | 'allkeys-random' | 'volatile-lru' | 'volatile-lfu' | 'volatile-random' | 'volatile-ttl' | 'noeviction';

/**
 * The database import source types
 * @param http HTTP import source
 * @param redis Redis import source
 * @param ftp FTP import source
 * @param aws-s3 S3 import source
 * @param azure-blob-storage Azure import source
 * @param google-blob-sotrage Google import source
 */
export type DatabaseImportSource = 'http' | 'redis' | 'ftp' | 'aws-s3' | 'azure-blob-storage' | 'google-blob-storage';

/**
 * The available database status
 * @param active The database status when it's activated
 * @param draft The database status when it's pending
 * @param active-change-pending The database status when it's pending for an active change (active + pending status)
 * @param 404 The database status when it's deleted (404 status code)
 * @param error The database status when it's in error
 * @param synced The database status when it's synced with it's replica's
 */
export type DatabaseStatus = 'active' | 'draft' | 'active-change-pending' | 404 | 'error' | 'synced';

/**
 * The replica of endpoints of the database
 */
export type DatabaseReplicaOfEndpoints = {
    endpoints: string[]
}

/**
 * The CRDB information
 * @param provider The provider of the database
 * @param region The region of the database
 * @param redisVersionCompliance The Redis version of the database
 * @param publicEndpoint The public endpoint of the database
 * @param privateEndpoint The private endpoint of the database
 * @param memoryLimitInGb The memory limit of the database
 * @param memoryUsedInMb The memory used in the database
 * @param readOperationsPerSecond The reads/second speed
 * @param writeOperationsPerSecond The writes/second speed
 * @param dataPersistence The data persistence of the database
 * @param alerts The database alerts
 * @param security The database security
 * @param backup The database backup
 */
export type CrdbDatabase = {
    provider: DatabaseProvider,
    region: string,
    redisVersionCompliance: string,
    publicEndpoint: string,
    privateEndpoint: string,
    memoryLimitInGb: number,
    memoryUsedInMb: number,
    readOperationsPerSecond: number,
    writeOperationsPerSecond: number,
    dataPersistence: DatabaseDataPersistence,
    alerts: DatabaseAlert[],
    security: DatabaseSecurity,
    backup: DatabaseBackup
    [key: string]: any
}

/**
 * The database backup
 * @param enableRemoteBackup The backup status
 * @param interval The backup time interval
 * @param destination The backup destination
 */
export type DatabaseBackup = {
    enableRemoteBackup: boolean,
    interval: BackupInterval,
    destination: string
}

/**
 * The Backup time intervals
 */
export type BackupInterval = 'every-24-hours' | 'every-12-hours' | 'every-6-hours' | 'every-4-hours' | 'every-2-hours' | 'every-1-hours';