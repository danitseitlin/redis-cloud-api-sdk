import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, CloudAccountStatus } from '../src/api';
import { CreateCloudAccountParameters } from '../src/interfaces/cloud-account'
import { TEST_CONFIG } from './config';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_CONFIG.API_ACCESS_KEY,
    secretKey: TEST_CONFIG.API_SECRET_KEY
}
const cloudAccountCredentials: CreateCloudAccountParameters = {
    name: 'My cloud account',
    accessKeyId: TEST_CONFIG.AWS_ACCESS_ID,
    accessSecretKey: TEST_CONFIG.AWS_SECRET_KEY,
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);

describe('Testing cloud account', async function() {
    this.timeout(1000 * 60 * 60);
    let cloudAccountId: number = -1;
    it('getCloudAccounts', async () => {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0, 'Checking if the cloud accounts are greater than 0');
    });
    it('createCloudAccount', async () => {
        const response: any = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
        cloudAccountId = response['resourceId'];
        expect(cloudAccountId).not.to.eql(undefined, 'Checking if the cloud account is created');
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.active);
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['stats']).to.eql(CloudAccountStatus.active, 'Checking the cloud account was created');
    });
    it('getCloudAccount', async () => {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0, 'Expecting to have more than 1 cloud account');
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['error']).not.to.eql('Not Found', 'Checking if the cloud account exists');
    });
    it('deleteCloudAccount', async () => {
        await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.deleted);
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['error']).to.eql('Not Found', 'Checking if the cloud account doesnt exist');
    });
  });