/**
 * The types of cloud account providers
 */

export type CloudAccount = {
    id: number,
    name: string,
    provider: string,
    status: string,
    accessKeyId?: string,
    [key: string]: any
};
 
export type CloudAccountProviderTypes = 'AWS' | 'GCP';