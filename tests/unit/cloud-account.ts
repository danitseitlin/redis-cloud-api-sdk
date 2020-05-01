import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { CloudAccountCreationParameters } from '../../src/types/parameters/cloud-account'
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const testArguments = loadArguments();
const mock = require('../mockers/cloud-account.json');
const server = new MockServer({
    hostname: testArguments.ENVIRONMENT,
    port: parseInt(testArguments.PORT),
    routes: mock.routes
});

const cloudAPISDKParameters: CloudAPISDKParameters = {
    protocol: 'http',
    domain: `${testArguments.ENVIRONMENT}:${testArguments.PORT}`,
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
}
const cloudAccountCredentials: CloudAccountCreationParameters = {
    name: 'My cloud account',
    accessKeyId: 'fake-creds',
    accessSecretKey: 'fake-creds',
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);

describe('Testing cloud account', async function() {
    this.timeout(10 * 60 * 60);
    let cloudAccountId: number = 1;
    before(async () => {
        server.start();
    });

    after(async () => {
        server.stop();
    });
    it('createCloudAccount', async () => {
        const response = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
        expect(response.message).to.eql(undefined, 'Error message existence');
        expect(response.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getCloudAccounts', async () => {
        const cloudAccounts = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.message).to.eql(undefined, 'Error message existence');
        expect(cloudAccounts.message).not.to.eql('Request failed with status code 404', 'Error message type');
    })
    it('getCloudAccount', async () => {
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount.message).to.eql(undefined, 'Error message existence');
        expect(cloudAccount.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('deleteCloudAccount', async () => {
        const response = await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        expect(response.message).to.eql(undefined, 'Error message existence');
        expect(response.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
});
