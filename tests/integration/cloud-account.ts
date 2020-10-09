import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { cliArguments } from 'cli-argument-parser';

const client = new CloudAPISDK({
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    domain: cliArguments.ENVIRONMENT,
    debug: (cliArguments.debug === 'true') ? true: false
});

describe('Testing cloud account', async function() {
    this.timeout(10 * 60 * 1000);
    let cloudAccountId: number = -1;
    it('createCloudAccount', async () => {
        const response = await client.createCloudAccount({
            name: 'My cloud account',
            accessKeyId: cliArguments.AWS_ACCESS_ID,
            accessSecretKey: cliArguments.AWS_SECRET_KEY,
            consoleUsername: 'console-username',
            consolePassword: 'console-password',
            signInLoginUrl: 'sign-in-login-url'
        });
        cloudAccountId = response.resourceId;
        console.log(`=== cloud account id: ${cloudAccountId} ===`);
        expect(cloudAccountId).not.to.eql(undefined, 'Cloud account id');
        await client.waitForCloudAccountStatus(cloudAccountId, 'active');
        const cloudAccount = await client.getCloudAccount(cloudAccountId);
        expect(cloudAccount.status).to.eql('active', 'Cloud account status');
    });
    it('getCloudAccounts', async () => {
        const cloudAccounts  = await client.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(2, 'Cloud accounts count');
    })
    it('getCloudAccount', async () => {
        const cloudAccount = await client.getCloudAccount(cloudAccountId);
        expect(cloudAccount.status).to.eql('active', 'Cloud account status');
    });
    it('deleteCloudAccount', async () => {
        await client.deleteCloudAccount(cloudAccountId);
        await client.waitForCloudAccountStatus(cloudAccountId, 404);
        const cloudAccount = await client.getCloudAccount(cloudAccountId);
        expect(cloudAccount.response.data.status).to.eql(404, 'Cloud account status')
    });
});
