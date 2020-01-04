export interface CreateDatabaseParameters {
    dryRun?: boolean,
    name: string,
    protocol?: 'redis' | 'memcached',
    memoryLimitInGb: number,
    supportOSSClusterApi?: boolean,
    useExternalEndpointForOSSClusterApi?: boolean,
    dataPersistence?: 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours',
    dataEvictionPolicy?: 'allkeys-lru' | 'allkeys-lfu' | 'allkeys-random' | 'volatile-lru' | 'volatile-lfu' | 'volatile-random' | 'volatile-ttl' | 'noeviction',
    replication?: boolean,
    throughputMeasurement?: {
        by: 'number-of-shards' | 'operations-per-second',
        value: number
    },
    averageItemSizeInBytes?: number,
    replicaOf?: string[],
    periodicBackupPath?: string,
    sourceIp?: string[],
    clientSslCertificate?: string,
    password?: string,
    alerts?: Array<{
        name: string,
        value: string
    }>,
    modules?: Array<{
        name: string,
        parameters: any
    }>
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
export interface UpdateDatabaseParameters { 
    dryRun?: boolean,
    name?: string,
    memoryLimitInGb?: number,
    supportOSSClusterApi?: boolean,
    useExternalEndpointForOSSClusterApi?: boolean,
    dataPersistence?: 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours',
    dataEvictionPolicy?: 'allkeys-lru' | 'allkeys-lfu' | 'allkeys-random' | 'volatile-lru' | 'volatile-lfu' | 'volatile-random' | 'volatile-ttl' | 'noeviction',
    replication?: boolean,
    throughputMeasurement?: {
        by: 'number-of-shards' | 'operations-per-second',
        value: number
    },
    replicaOf?: string[],
    periodicBackupPath?: string,
    sourceIp?: string[],
    clientSslCertificate?: string,
    password?: string,
    alerts?: Array<{
        name: string,
        value: string
    }>,
    regexRules?: string[]
}

/**
 * The parameters needed to import a database file into an existing database
 * @param sourceType Required. Type of storage source from which to import the database file (RDB files) or data (Redis connection)
 * @param importFromUri Required. One or more URIs to source data files or Redis databases, as appropriate to specified source type (example: ['http://mydomain.com/redis-backup-file1’, ‘http://mydomain.com/redis-backup-file2’])
 */
export interface DatabaseImportParameters {
    sourceType: 'http' | 'redis' | 'ftp' | 'aws-s3' | 'azure-blob-storage' | 'google-blob-storage',
    importFromUri: string[]
}
