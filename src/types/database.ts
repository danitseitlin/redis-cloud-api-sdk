import { DatabaseModule } from "./general";
import { ErrorResponse } from "./task";

export type Database = {
    databaseId: number,
    protocol: DatabaseProtocol,
    provider: DatabaseProvider,
    region: string,
    status: DatabaseStatus,
    memoryLimitInGb: number,
    memoryUsedInMb: number,
    memoryStorage: DatabaseMemoryStorage,
    supportOSSClusterApi: boolean,
    dataPersistence: DatabaseDataPersistence,
    replication: boolean,
    dataEvictionPolicy: DatabaseDataEvictionPolicy,
    throughputMeasurement: DatabaseThroughputMeasurement,
    replicaOf: null | string[],
    clustering: DatabaseClustering,
    security: DatabaseSecurity,
    modules: DatabaseModule[],
    alerts: any[],
    [key: string]: any
}

export type DatabaseSecurity = {
    sslClientAuthentication: boolean,
    sourceIps: string[],
    [key: string]: any
}

export type DatabaseClustering = {
    numberOfShards?: number,
    regexRules?: any[],
    hashingPolicy: any[],
    [key: string]: any
}

export type DatabaseMemoryStorage = 'ram' | 'ram-and-flash';

export type DatabaseProvider = 'AWS' | 'GCP';

/**
 * The database protocol types
 */
export type DatabaseProtocol = 'redis' | 'memcached';

/**
 * The database data persistence types
 */
export type DatabaseDataPersistence = 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours';

/**
 * The database data eviction policy types
 */
export type DatabaseDataEvictionPolicy = 'allkeys-lru' | 'allkeys-lfu' | 'allkeys-random' | 'volatile-lru' | 'volatile-lfu' | 'volatile-random' | 'volatile-ttl' | 'noeviction';

/**
 * The database throughput measurement
 */
export type DatabaseThroughputMeasurement = {
    by: 'number-of-shards' | 'operations-per-second',
    value: number,
    [key: string]: any
}

/**
 * The database import source types
 */
export type DatabaseImportSource = 'http' | 'redis' | 'ftp' | 'aws-s3' | 'azure-blob-storage' | 'google-blob-storage';

/**
 * The available database status
 * @param active activate status
 * @param draft pending status
 * @param active-change-pending pending change status
 * @param 404 deleted status
 * @param error error status
 */
export type DatabaseStatus = 'active' | 'draft' | 'active-change-pending' | '404' | 'error';