/**
 * The database protocol types
 */
export type DatabaseProtocolTypes = 'redis' | 'memcached';

/**
 * The database data persistence types
 */
export type DatabaseDataPersistenceTypes = 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours';

/**
 * The database data eviction policy types
 */
export type DatabaseDataEvictionPolicyTypes = 'allkeys-lru' | 'allkeys-lfu' | 'allkeys-random' | 'volatile-lru' | 'volatile-lfu' | 'volatile-random' | 'volatile-ttl' | 'noeviction';

/**
 * The database throughput measturement by types
 */
export type DatabaseThroughputMeasurementByTypes = 'number-of-shards' | 'operations-per-second';

/**
 * The database import source types
 */
export type DatabaseImportSourceTypes = 'http' | 'redis' | 'ftp' | 'aws-s3' | 'azure-blob-storage' | 'google-blob-storage';