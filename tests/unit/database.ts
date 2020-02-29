import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionStatus, DatabaseStatus, CloudAccountStatus } from '../../src/api';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from '../../src/interfaces/database';
import { loadArguments } from '../helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    this.timeout(1000 * 60 * 60);
    let subscriptionId: number = -1;
    let databaseId: number = -1;
    it('getDatabases', async () => {
        const databases: any = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases.response.data.message).to.eql(`Subscription ${subscriptionId}: no databases found`, 'Error message type');
    });
    it('createDatabase', async () => {
        const createParameters: CreateDatabaseParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase: any = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        expect(createDatabase.error.description).to.eql('Subscription was not found', 'Error message type');
    });
    it('getDatabase', async () => {
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database.response.data.message).to.eql(`Subscription ${subscriptionId} database ${databaseId} not found`, 'Error message type');
    });
    it('updateDatabase', async () => {
        const updateParameters: UpdateDatabaseParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase: any = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        expect(updateDatabase.error.description).to.eql('Database was not found', 'Error message type');
    });
    it('deleteDatabase', async () => {
        const deleteDatabaseResponse = await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        expect(deleteDatabaseResponse.error.description).to.eql('Database was not found', 'Error message type');
    });
    it('backupDatabase', async () => {
        const response: any = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        expect(response.error.description).to.eql('Database was not found', 'Error message type');
    });
    it('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response: any = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response.error.description).to.eql('Database was not found', 'Error message type');
    });
});