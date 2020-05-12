import { expect } from 'chai';
import { CloudAPISDK } from '../../src/api';
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const testArguments = loadArguments();
const mock = require('../mockers/cloud-account.json');
const server = new MockServer({
    hostname: testArguments.ENVIRONMENT,
    port: parseInt(testArguments.PORT),
    routes: mock.routes
});

const cloudAPIClient = new CloudAPISDK({
    protocol: 'http',
    domain: `${testArguments.ENVIRONMENT}:${testArguments.PORT}`,
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
});

describe('Testing cloud account', async function() {
    this.timeout(10 * 60 * 60);
    const cloudAccountId = 1;
    before(async () => {
        server.start();
    });

    after(async () => {
        server.stop();
    });
    it('createCloudAccount', async () => {
        const response = await cloudAPIClient.createCloudAccount({
            name: 'My cloud account',
            accessKeyId: 'fake-creds',
            accessSecretKey: 'fake-creds',
            consoleUsername: 'console-username',
            consolePassword: 'console-password',
            signInLoginUrl: 'sign-in-login-url'
        });
        expect(response.resourceId).to.eql(1, 'Cloud account id');
    });
    it('getCloudAccounts', async () => {
        const cloudAccounts = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(1, 'Cloud accounts count');
    })
    it('getCloudAccount', async () => {
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount.id).to.eql(1, 'Cloud account id');
        expect(cloudAccount.name).to.eql('My cloud account', 'Cloud account name');
    });
    it('deleteCloudAccount', async () => {
        const response = await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        expect(response.resourceId).to.eql(1, 'Cloud account id');
    });
});
