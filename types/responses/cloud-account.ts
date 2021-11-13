/**
 * Cloud account object
 * @param id The id of the cloud account
 * @param name The name of the cloud account
 * @param provider The provider of the cloud account
 * @param status The status of the cloud account
 * @param accessKeyId The access key id of the cloud account
 */

export type CloudAccountResponse = {
    id: number,
    name: string,
    provider: string,
    status: CloudAccountStatus,
    accessKeyId?: string,
    [key: string]: any
};

/**
 * The cloud account providers
 * @param AWS Amazon Web Services provider
 * @param GCP Google Cloud Platform provider
 */
export type CloudAccountProvider = 'AWS' | 'GCP';

/**
 * The cloud account status
 * @param active Active status
 * @param draft Pending status
 * @param change-draft Pending change status
 * @param error Error status
 * @param 404 Deleted status
 */

export type CloudAccountStatus = 'active' | 'draft' | 'change-draft' | 'error' | 404; 