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
        expect(cloudAccounts.length).gt(0);
    }); 
    it('createCloudAccount', async function() {
        //Create a cloud account and then get it to make sure it was created properly.
        
    })
    it('getCloudAccount', async function() {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0, 'Expecting to have more than 1 cloud account');
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccounts[0]['id']);
        expect(cloudAccount)
    }); 
    it('deleteCloudAccount', async function() {
        //Delete the existing cloud account you created and validate it was removed.
    })
  });