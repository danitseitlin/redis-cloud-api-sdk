import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from '../../src/types/parameters/database';
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const TEST_ARGUMENTS = loadArguments();
const server = new MockServer({
    hostname: TEST_ARGUMENTS.ENVIRONMENT,
    port: parseInt(TEST_ARGUMENTS.PORT),
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
    domain: `${TEST_ARGUMENTS.ENVIRONMENT}:${TEST_ARGUMENTS.PORT}`,
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
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
        const databases: any = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases[0]).to.eql({ id: 1 }, 'Error message type');
    });
    it('createDatabase', async () => {
        const createParameters: CreateDatabaseParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase: any = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        expect(createDatabase).to.not.eql(undefined, 'Error message type');
    });
    it('getDatabase', async () => {
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database).to.not.eql(undefined, 'Error message type');
    });
    it('updateDatabase', async () => {
        const updateParameters: UpdateDatabaseParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase: any = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        expect(updateDatabase).to.not.eql(undefined, 'Error message type');
    });
    it('deleteDatabase', async () => {
        const deleteDatabaseResponse = await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        expect(deleteDatabaseResponse).to.not.eql(undefined, 'Error message type');
    });
    it('backupDatabase', async () => {
        const response: any = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        expect(response).to.not.eql(undefined, 'Error message type');
    });
    it('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response: any = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response).to.not.eql(undefined, 'Error message type');
    });
});