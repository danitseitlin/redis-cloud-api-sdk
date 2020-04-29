import { expect } from 'chai';
import { CloudAPISDK } from '../../src/api';
import { loadArguments } from '../helpers';

const testArguments = loadArguments();

const cloudAPIClient = new CloudAPISDK({
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
    domain: testArguments.ENVIRONMENT
});

describe('Testing cloud account', async function() {
    this.timeout(10 * 60 * 1000);
    let cloudAccountId: number = -1;
    it('createCloudAccount', async () => {
        const response = await cloudAPIClient.createCloudAccount({
            name: 'My cloud account',
            accessKeyId: testArguments.AWS_ACCESS_ID,
            accessSecretKey: testArguments.AWS_SECRET_KEY,
            consoleUsername: 'console-username',
            consolePassword: 'console-password',
            signInLoginUrl: 'sign-in-login-url'
        });
        cloudAccountId = response.resourceId;
        console.log(`=== cloudAccountId: ${cloudAccountId} ===`);
        expect(cloudAccountId).not.to.eql(undefined, `Cloud account id`);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, 'active');
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount.status).to.eql('active', 'Cloud Account status');
    });
    it('getCloudAccounts', async () => {
        const cloudAccounts  = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(2, 'Cloud accounts count');
    })
    it('getCloudAccount', async () => {
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount.status).to.eql('active', 'Cloud account status');
    });
    it('deleteCloudAccount', async () => {
        await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, 404);
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount.response.data.status).to.eql(404, 'Cloud account status')
    });
});
