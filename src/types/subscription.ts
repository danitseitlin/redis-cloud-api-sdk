import { Region } from "./general";

/**
 * The subscription memory storage types
 */
export type SubscriptionMemoryStorageTypes = 'ram' | 'ram-and-flash';

/**
 * The subscription cloud provider types
 */
export type SubscriptionCloudProviderTypes = 'AWS' | 'GCP';

export type Subscription = {
    id: number,
    status: SubscriptionStatus,
    paymentMethodId: number,
    memoryStorage: SubscriptionMemoryStorageTypes,
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
    provider: SubscriptionCloudProviderTypes,
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

export type SubscriptionPeering = {
    peerings: any[]
}

/**
 * The availiable subscription status
 * @param active Active status
 * @param pending Pending status
 * @param error Error status
 * @param 404 Delete status
 */
export type SubscriptionStatus = 'active' | 'pending' | 'error' | '404';
