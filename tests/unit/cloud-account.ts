import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { CreateCloudAccountParameters } from '../../src/types/parameters/cloud-account'
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const TEST_ARGUMENTS = loadArguments();
const server = new MockServer({
    hostname: TEST_ARGUMENTS.ENVIRONMENT,
    port: parseInt(TEST_ARGUMENTS.PORT),
    routes: [{
        path: '/v1/cloud-accounts',
        method: 'post',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/tasks/1',
        method: 'get',
        response: {
            response: {
                status: 'processing-completed'
            }
        }
    },{
        path: '/v1/cloud-accounts',
        method: 'get',
        response: {
            cloudAccounts: [{
                id: 1
            }]
        }
    },{
        path: '/v1/cloud-accounts/1',
        method: 'get',
        response: {
            id: 1,
            name: 'My cloud account'
        }
    },{
        path: '/v1/cloud-accounts/1',
        method: 'delete',
        response: {
            taskId: 1
        }
    }]
});

const cloudAPISDKParameters: CloudAPISDKParameters = {
    protocol: 'http',
    domain: `${TEST_ARGUMENTS.ENVIRONMENT}:${TEST_ARGUMENTS.PORT}`,
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
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
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount.message).to.eql(undefined, 'Error message existence');
        expect(cloudAccount.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('deleteCloudAccount', async () => {
        const response = await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        expect(response.message).to.eql(undefined, 'Error message existence');
        expect(response.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
});
