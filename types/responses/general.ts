/**
 * Account information object
 * @param id The id of the account
 * @param name The email address of the account
 * @param createdTimestamp The creation timestamp of the account
 * @param updatedTimestamp The updated timestamp of the account
 * @param key The key of the additional information of the account
 * @param key.name The name of the account
 * @param key.accountId The id of the account
 * @param key.accountName The email address of the account
 * @param key.allowedSourceIps The allowed source IP's of the account
 * @param key.createdTimestamp The creation timestamp of the account
 * @param key.owner The information of the account owner
 * @param key.owner.name The name of the account owner
 * @param key.owner.email The email address of the account owner
 * @param key.httpSourceIp The source IP of the account
 * @param key.gcpAccount If the account is a GCP account
 */
export type AccountInformation = {
    id: number,
    name: string,
    createdTimestamp: string,
    updatedTimestamp: string,
    key: {
        name: string,
        accountId: number,
        accountName: string,
        allowedSourceIps: string[],
        createdTimestamp: string,
        owner: {
            name: string,
            email: string
        },
        httpSourceIp: string,
        gcpAccount: boolean
        [key: string]: any
    },
    [key: string]: any
}

/**
 * Data persistence object
 * @param name The name of the data-persistence
 * @param description The description of the data-persistence
 */
export type DataPersistence = {
    name: string,
    description: string
}

/**
 * Database module object
 * @param id The ID of the module
 * @param name The name of the module
 * @param version The version of the module
 * @param description The description of the module
 * @param parameters The parameters of the module
 */
export type DatabaseModule = {
    id: number,
    name: string,
    version: string,
    description: string,
    parameters: DatabaseModuleParameter[],
    [key: string]: any
}

/**
 * Database module parameter object
 * @param name The name of the module parameter
 * @param description The description of the module parameter
 * @param type The type of the module parameter
 * @param defaultValue The default value of the module parameter
 * @param required Is the parameter of the module required
 */
export type DatabaseModuleParameter = {
    name?: string,
    description?: string,
    type?: string,
    defaultValue?: number,
    required?: boolean,
    [key: string]: any
}

/**
 * System log object
 * @param id The id of the log
 * @param time The time of the log
 * @param originator The originator of the log
 * @param apiKeyName The api key name of the log
 * @param type The type of the log
 * @param description The description of the log
 */
export type SystemLog = {
    id: number,
    time: string,
    originator: string,
    apiKeyName: string,
    type: string,
    description: string,
    [key: string]: any
}

/**
 * Payment method object
 * @param id The id of the payment method
 * @param type The type of the payment method
 * @param creditCardEndsWith The last digits of the credit card
 * @param nameOnCard The name of the credit card holder
 * @param expirationMonth The expiration month of the credit card
 * @param expirationYear The expiration year of the credit card
 */
export type PaymentMethod = {
    id: number,
    type: string,
    creditCardEndsWith: number,
    nameOnCard: string,
    expirationMonth: number,
    expirationYear: number
}

/**
 * Subscription plan object
 * @param id The id of the plan
 * @param name The name of the plan
 * @param provider The provider of the plan
 * @param region The region of the plan
 * @param price The price of the plan
 * @param priceCurrency The price currency of the plan
 * @param pricePeriod The price period of the plan
 * @param supportsRedisOnFlash If the plan supports Redis on Flash
 * @param supportsMultipleAvailabilityZones If the plan supports Multi Availability Zones
 * @param maximumNumberOfDatabases The maximum number of database allowed in the plan
 * @param memorySizeInMb The memory size in MB of the plan
 * @param throughputOperationsPerSecond The throughput operations per second of the plan
 * @param planType The type of the plan
 */
export type Plan = {
    id: number,
    name: string,
    provider: string,
    region: string,
    price: number,
    priceCurrency: string,
    pricePeriod: string,
    supportsRedisOnFlash: boolean,
    supportsMultipleAvailabilityZones: boolean,
    maximumNumberOfDatabases: number,
    memorySizeInMb: number,
    throughputOperationsPerSecond: number,
    planType: string,
    [key: string]: any
}

/**
 * Region object
 * @param name The name of the region
 * @param provider The provider of the region
 * @param RegionNetworking The networking of the region
 * @param preferredAvailabilityZones The preferred availability zones
 * @param multipleAvailabilityZones The multiple availability zones
 */
export type Region = {
    name: string,
    provider: string,
    networking: RegionNetworking[],
    preferredAvailabilityZones: string[],
    multipleAvailabilityZones: boolean
    [key: string]: any
}

/**
 * Region's networking object
 * @param deploymentCIDR The Deployment CIDR
 * @param subnetId The subnetId 
 */
export type RegionNetworking = {
    deploymentCIDR: string,
    subnetId: string
}

/**
 * The payment methods for subscriptions
 */
export type SubscriptionPaymentMethod = 'credit-card' | 'marketplace' ;