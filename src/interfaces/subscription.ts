export interface createSubscriptionParameters {
    name?: string,
    dryRun?: boolean,
    paymentMethodId: number,
    memoryStorage?: 'ram' | 'ram-and-flash',
    persistentStorageEncryption?: boolean,
    cloudProviders: Array<{
        provider?: string,
        cloudAccountId?: number,
        regions: Array<{
            region: string,
            multipleAvailabilityZones?: boolean,
            preferredAvailabilityZones?: string[],
            networking: {
                deploymentCIDR: string,
                vpcId?: string
            }
        }>
    }>,
    databases: Array<{
        name: string,
        protocol?: 'redis' | 'memcached',
        memoryLimitInGb: number,
        supportOSSClusterApi?: boolean,
        dataPersistence?: 'none' | 'aof-every-1-second' | 'aof-every-write' | 'snapshot-every-1-hour' | 'snapshot-every-6-hours' | 'snapshot-every-12-hours',
        replication?: boolean,
        throughputMeasurement?: {
            by: 'number-of-shards' | 'operations-per-second',
            value: number
        },
        modules: string[], //Verify this!
        quantity?: number,
        averageItemSizeInBytes?: number
    }>
}

export interface updateSubscriptionParameters {
    name?: string,
    paymentMethodId?: number
}

export interface updateSubscriptionCidrWhitelistParameters {
    cidrIps: string[],
    securityGroupIds: string[]
}

export interface createSubscriptionVpcPeeringParameters {
    region: string,
    awsAccountId: string,
    vpcId: string,
    vpcCidr: string
}

