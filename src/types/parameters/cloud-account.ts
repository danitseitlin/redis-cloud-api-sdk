import { CloudAccountProvider } from '../responses/cloud-account';

/**
 * The parameters needed to create a cloud account
 * @param accessKeyId Required. Cloud provider access key
 * @param accessSecretKey Required. Cloud provider secret key
 * @param consolePassword Required. Cloud provider management console password
 * @param consoleUsername Required. Cloud provider management console username
 * @param name Required. Cloud account display name
 * @param provider Optional. Cloud provider. Default: ‘AWS’
 * @param signInLoginUrl Required. Cloud provider management console login URL
 */
export type CreateCloudAccountParameters = {
    accessKeyId: string,
    accessSecretKey: string,
    consolePassword: string,
    consoleUsername: string,
    name: string,
    provider?: CloudAccountProvider,
    signInLoginUrl: string
}

/**
 * The parameters needed to update a cloud account
 * @param accessKeyId Required. Cloud provider access key
 * @param accessSecretKey Required. Cloud provider secret key
 * @param consolePassword Required. Cloud provider management console password
 * @param consoleUsername Required. Cloud provider management console username
 * @param name Optional. Cloud account display name
 * @param signInLoginUrl Optional. Cloud provider management console login URL
 */
export type UpdateCloudAccountParameters = {
    accessKeyId: string,
    accessSecretKey: string,
    consolePassword: string,
    consoleUsername: string,
    name?: string,
    signInLoginUrl?: string
}