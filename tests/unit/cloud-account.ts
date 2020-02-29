import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, CloudAccountStatus } from '../../src/api';
import { CreateCloudAccountParameters } from '../../src/interfaces/cloud-account'
import { loadArguments } from '../helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}
const cloudAccountCredentials: CreateCloudAccountParameters = {
    name: 'My cloud account',
    accessKeyId: 'fake-creds',
    accessSecretKey: 'fake-creds',
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);

describe('Testing cloud account', async function() {
    this.timeout(1000 * 60 * 60);
    let cloudAccountId: number = -1;
    it('createCloudAccount', async () => {
        const response: any = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
        expect(response.message).to.eql(undefined, 'Error message existence');
        expect(response.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getCloudAccounts', async () => {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.message).to.eql(undefined, 'Error message existence');
        expect(cloudAccounts.message).not.to.eql('Request failed with status code 404', 'Error message type');
    })
    it('getCloudAccount', async () => {
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(1);
        expect(cloudAccount.message).to.eql(undefined, 'Error message existence');
        expect(cloudAccount.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('deleteCloudAccount', async () => {
        const response = await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        expect(response.message).to.eql(undefined, 'Error message existence');
        expect(response.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
});
