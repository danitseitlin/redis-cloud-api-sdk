export type DatabaseProtocolTypes = 'redis' | 'memcached';
export type DatabaseDataPersistenceTypes = 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours';
export type DatabaseDataEvictionPolicyTypes = 'allkeys-lru' | 'allkeys-lfu' | 'allkeys-random' | 'volatile-lru' | 'volatile-lfu' | 'volatile-random' | 'volatile-ttl' | 'noeviction';
export type DatabaseThroughputMeasurementByTypes = 'number-of-shards' | 'operations-per-second';
export type DatabaseImportSourceTypes = 'http' | 'redis' | 'ftp' | 'aws-s3' | 'azure-blob-storage' | 'google-blob-storage';