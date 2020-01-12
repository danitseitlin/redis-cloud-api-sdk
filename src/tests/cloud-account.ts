import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../api';
import { CreateCloudAccountParameters } from '../interfaces/cloud-account'
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: '',
    secretKey: ''
}
const cloudAccountCredentials: CreateCloudAccountParameters = {
    name: 'My cloud account',
    accessKeyId: 'access-key-id',
    accessSecretKey: 'access-secret-key',
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing cloud account', async function() {
    let cloudAccountId: number = -1;
    it('getCloudAccounts', async function() {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0, 'Checking if the cloud accounts are greater than 0');
    }); 
    it('createCloudAccount', async function() {
        const response: any = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
        cloudAccountId = response['resourceId'];
        expect(cloudAccountId).not(undefined, 'Checking if the cloud account is created');
    });
    it('getCloudAccount', async function() {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0, 'Expecting to have more than 1 cloud account');
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['error']).not('Not Found', 'Checking if the cloud account exists');
    }); 
    it('deleteCloudAccount', async function() {
        await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['error']).eql('Not Found', 'Checking if the cloud account doesnt exist');
    });
  });