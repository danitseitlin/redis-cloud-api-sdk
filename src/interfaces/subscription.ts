/**
 * The parameters needed to create a subscription
 * @param name Optional. Subscription name
 * @param dryRun Optional. When 'false’: Creates a deployment plan and deploys it (creating any resources required by the plan). When 'true’: creates a read-only deployment plan without any resource creation. Default: ‘true’
 * @param paymentMethodId Required. A valid payment method (credit card, wire transfer etc) pre-defined in the current account. It will be billed for any charges related to the created subscription)
 * @param memoryStorage Optional. Memory storage preference: either ‘ram’ or a combination of 'ram-and-flash’. Default: ‘ram’
 * @param persistentStorageEncryption Optional. Encrypt data stored in persistent storage. Required for a GCP subscription. Default: ‘false’
 * @param cloudProviders Required. Cloud hosting & networking details
 * @param cloudProviders.provider Optional. Cloud provider. Default: ‘AWS’
 * @param cloudProviders.cloudAccountId Optional. Cloud account identifier. Default: Redis Labs internal cloud account (using Cloud Account Id = 1 implies using Redis Labs internal cloud account). Note that a GCP subscription can be created only with Redis Labs internal cloud account.
 * @param cloudProviders.regions Required. Cloud networking details, per region (single region or multiple regions for Active-Active cluster only)
 * @param cloudProviders.regions.region Required. Deployment region as defined by cloud provider
 * @param cloudProviders.regions.multipleAvailabilityZones Optional. Support deployment on multiple availability zones within the selected region. Default: ‘false’
 * @param cloudProviders.regions.preferredAvailabilityZones Optional. Availability zones deployment preferences (for the selected provider & region). Example = '['us-east-1a’, 'us-east-1c’, ‘us-east-2e’]'
 * @param cloudProviders.regions.networking The networking of the subscription
 * @param cloudProviders.regions.deploymentCIDR Required. Deployment CIDR mask. Default: If using Redis Labs internal cloud account, 192.168.0.0/24
 * @param cloudProviders.regions.vpcId Optional. Either an existing VPC Id (already exists in the specific region) or create a new VPC (if no VPC is specified). VPC Identifier must be in a valid format (for example: ‘vpc-0125be68a4625884ad’) and existing within the hosting account
 * @param databases.name Required. Database name (Database name must be up to 40 characters long, include only letters, digits, or hyphen ('-'), start with a letter, and end with a letter or digit)
 * @param databases.protocol Optional. Database protocol: either ‘redis’ or 'memcached’. Default: ‘redis’
 * @param databases.memoryLimitInGb Required. Maximum memory usage for this specific database
 * @param databases.supportOSSClusterApi Optional. Support Redis open-source (OSS) Cluster API. Default: ‘false’
 * @param databases.dataPersistence Optional. Rate of database data persistence (in persistent storage). Default: ‘none’
 * @param databases.replication Optional. Databases replication. Default: ‘true’
 * @param databases.throughputMeasurement The throughput measurement of the database
 * @param databases.throughputMeasurement.by Required. Throughput measurement method. Either ‘number-of-shards’ or ‘operations-per-second’
 * @param databases.throughputMeasurement.value Required. Throughput value (as applies to selected measurement method)
 * @param databases.modules Optional. Redis Labs modules to be provisioned in the database
 * @param databases.quantity Optional. Number of databases (of this type) that will be created. Default: 1
 * @param databases.averageItemSizeInBytes Optional. Relevant only to ram-and-flash clusters. Estimated average size (measured in bytes) of the items stored in the database. Default: 1000
 */
export interface CreateSubscriptionParameters {
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

/**
 * The parameters needed to update a database
 * @param name Subscription name
 * @param paymentMethodId Payment method Id
 */
export interface UpdateSubscriptionParameters {
    name?: string,
    paymentMethodId?: number
}

/**
 * The parameters needed to update the database CIDR whitelist
 * @param cidrIps CIDR values in an array format (example: [‘10.1.1.0/32’])
 * @param securityGroupIds AWS Security group identifier
 */
export interface UpdateSubscriptionCidrWhitelistParameters {
    cidrIps: string[],
    securityGroupIds: string[]
}

/**
 * The parameters needed to create a VPC peering for a database
 * @param region Deployment region as defined by cloud provider
 * @param awsAccountId AWS Account uid
 * @param vpcId VPC uid
 * @param vpcCidr VPC cidr
 */
export interface CreateSubscriptionVpcPeeringParameters {
    region: string,
    awsAccountId: string,
    vpcId: string,
    vpcCidr: string
}

