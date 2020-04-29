import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { DatabaseCreationParameters, DatabaseUpdateParameters, DatabaseImportParameters } from '../../src/types/parameters/database';
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const testArguments = loadArguments();
const server = new MockServer({
    hostname: testArguments.ENVIRONMENT,
    port: parseInt(testArguments.PORT),
    routes: [{
        path: '/v1/subscriptions/1/databases',
        method: 'get',
        response: {
            subscription: [{
                databases: [{
                    id: 1
                }]
            }]
        }
    },{
        path: '/v1/subscriptions/1/databases',
        method: 'post',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/databases/1',
        method: 'get',
        response: {
            id: 1
        }
    },{
        path: '/v1/subscriptions/1/databases/1',
        method: 'put',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/databases/1',
        method: 'delete',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/databases/1/backup',
        method: 'post',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/databases/1/backup',
        method: 'post',
        response: {
            taskId: 1
        }
    }]
});
const cloudAPISDKParameters: CloudAPISDKParameters = {
    protocol: 'http',
    domain: `${testArguments.ENVIRONMENT}:${testArguments.PORT}`,
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    this.timeout(10 * 60 * 60);
    let subscriptionId: number = 1;
    let databaseId: number = 1;
    before(async () => {
        server.start();
    });

    after(async () => {
        server.stop();
    });

    it('getDatabases', async () => {
        const databases = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases[0]).to.eql({ id: 1 }, 'Error message type');
    });
    it('createDatabase', async () => {
        const createParameters: DatabaseCreationParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        expect(createDatabase).to.not.eql(undefined, 'Error message type');
    });
    it('getDatabase', async () => {
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database).to.not.eql(undefined, 'Error message type');
    });
    it('updateDatabase', async () => {
        const updateParameters: DatabaseUpdateParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        expect(updateDatabase).to.not.eql(undefined, 'Error message type');
    });
    it('deleteDatabase', async () => {
        const deleteDatabaseResponse = await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        expect(deleteDatabaseResponse).to.not.eql(undefined, 'Error message type');
    });
    it('backupDatabase', async () => {
        const response = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        expect(response).to.not.eql(undefined, 'Error message type');
    });
    it('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response).to.not.eql(undefined, 'Error message type');
    });
});