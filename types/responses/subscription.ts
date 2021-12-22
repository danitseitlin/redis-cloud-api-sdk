import { Region } from './general';

/**
 * Subscription object
 * @param id The id of the subscription
 * @param status The status of the subscription
 * @param paymentMethodId The payment method id of the subscription
 * @param memoryStorage The memory storage of the subscription
 * @param storageEncryption The storage encryption of the subscription
 * @param numberOfDatabases The databases count of the subscription
 * @param subscriptionPricing The pricing of the subscription
 * @param cloudDetails The cloud details of the subscription
 */
export type SubscriptionResponse = {
    id: number,
    name: string,
    status: SubscriptionStatus,
    paymentMethodId: number,
    memoryStorage: SubscriptionMemoryStorage,
    storageEncryption: boolean,
    numberOfDatabases: number,
    subscriptionPricing: SubscriptionPricing[],
    cloudDetails: SubscriptionCloudDetails[],
    [key: string]: any
}

/**
 * Subscription pricing object
 * @param type The type of the subscription pricing
 * @param quantity The quantity of the subscription pricing
 * @param quantityMeasurement The quantity measurement of the subscription pricing
 * @param databaseName The name of the database
 * @param typeDetails The details of the type measurement of the subscription pricing
 * @param pricePerUnit The price per unit of the type measurement of the subscription pricing
 * @param priceCurrency The currency of the price
 * @param pricePeriod The time period of the price
 */
export type SubscriptionPricing = {
    type: string,
    quantity: number,
    quantityMeasurement: string,
    databaseName?: string,
    typeDetails?: string,
    pricePerUnit?: number,
    priceCurrency?: string,
    pricePeriod?: string,
    [key: string]: any
}

/**
 * Subscription cloud details object
 * @param provider The provider of the cloud details
 * @param cloudAccountId The cloud account id of the cloud details
 * @param totalSizeInGb The total size in GB of the cloud details
 * @param regions The regions of the cloud details
 */
export type SubscriptionCloudDetails = {
    provider: SubscriptionCloudProvider,
    cloudAccountId: number,
    totalSizeInGb: number,
    regions: Region[],
    [key: string]: any
}

/**
 * Subscription CIDR whitelists
 * @param cidr_ips The list of the cidr ips
 * @param security_group_ids The list of the security groups
 * @param the list of the errors
 */
export type SubscriptionCidrWhitelist = {
    cidr_ips: string[],
    security_group_ids: string[],
    errors: any[]
}

/**
 * Subscription VPC Peering
 * @param id The id of the vpc peering
 * @param status The status of the vpc peering
 */
export type SubscriptionVpcPeering = {
    id: number,
    status: SubscriptionVpcPeeringStatus
}

/**
 * The availiable subscription status
 * @param active Active status
 * @param pending Pending status
 * @param error Error status
 * @param 404 Delete status
 */
export type SubscriptionStatus = 'active' | 'pending' | 'error' | 'deleting' | 404;

/**
 * The availiable subscription vpc peering status
 * @param active Active status
 * @param inactive Inactive status
 * @param pending-acceptance Pending status
 * @param failed Error status
 */
export type SubscriptionVpcPeeringStatus = 'active' | 'inactive' | 'pending-acceptance' | 'failed';

/**
 * The subscription memory storage types
 * @param ram Redis on RAM memory storage
 * @param ram-and-flash Redis on Flash memory storage
 */
export type SubscriptionMemoryStorage = 'ram' | 'ram-and-flash';

/**
 * The subscription cloud provider types
 * @param AWS Amazon Web Service cloud provider
 * @param GCP Google Cloud Platform cloud provider
 */
export type SubscriptionCloudProvider = 'AWS' | 'GCP';