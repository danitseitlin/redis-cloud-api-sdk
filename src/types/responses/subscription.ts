import { Region } from './general';

export type Subscription = {
    id: number,
    status: SubscriptionStatus,
    paymentMethodId: number,
    memoryStorage: SubscriptionMemoryStorage,
    storageEncryption: boolean,
    numberOfDatabases: number,
    subscriptionPricing: SubscriptionPricing[],
    cloudDetails: SubscriptionCloudDetails[],
    [key: string]: any
}

export type SubscriptionPricing = {
    type: string,
    quantity: number,
    quantityMeasurement: string,
    [key: string]: any
}

export type SubscriptionCloudDetails = {
    provider: SubscriptionCloudProvider,
    cloudAccountId: number,
    totalSizeInGb: number,
    regions: Region[],
    [key: string]: any
}

export type SubscriptionCidrWhitelist = {
    cidr_ips: any[],
    security_group_ids: any[],
    errors: any[]
}

export type SubscriptionVpcPeering = {
    id?: number,
    status?: SubscriptionVpcPeeringStatus
}

/**
 * The availiable subscription status
 * @param active Active status
 * @param pending Pending status
 * @param error Error status
 * @param 404 Delete status
 */
export type SubscriptionStatus = 'active' | 'pending' | 'error' | '404';

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
 */
export type SubscriptionMemoryStorage = 'ram' | 'ram-and-flash';

/**
 * The subscription cloud provider types
 */
export type SubscriptionCloudProvider = 'AWS' | 'GCP';