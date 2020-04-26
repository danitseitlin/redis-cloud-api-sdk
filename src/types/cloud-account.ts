/**
 * The types of cloud account providers
 */

export type CloudAccount = {
    id: number,
    name: string,
    provider: string,
    status: CloudAccountStatus,
    accessKeyId?: string,
    [key: string]: any
};
 
export type CloudAccountProviderTypes = 'AWS' | 'GCP';

/**
 * The available cloud account status
 * @param active Active status
 * @param draft Pending status
 * @param change-draft Pending change status
 * @param error Error status
 * @param 404 Deleted status
 */

export type CloudAccountStatus = 'active' | 'draft' | 'change-draft' | 'error' | '404'; 