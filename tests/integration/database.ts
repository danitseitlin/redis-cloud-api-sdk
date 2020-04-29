import { expect } from 'chai';
import { CloudAPISDK } from '../../src/api';
import { DatabaseCreationParameters, DatabaseUpdateParameters, DatabaseImportParameters } from '../../src/types/parameters/database';
import { loadArguments } from '../helpers';

const testArguments = loadArguments();

const cloudAPIClient = new CloudAPISDK({
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
    domain: testArguments.ENVIRONMENT
});
describe('Testing databases', async function() {
    this.timeout(60 * 60 * 1000);
    let subscriptionId: number = -1;
    let databaseId: number = -1;
    it('getSubscription', async () => {
        subscriptionId = (await cloudAPIClient.getSubscriptions())[0].id;
    });
    it('getDatabases', async () => {
        const databases = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases.length).to.eql(1, 'Database list length');
    });
    it('createDatabase', async () => {
        const createParameters: DatabaseCreationParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        const databaseId: number = createDatabase.resourceId;
        expect(databaseId).not.to.eql(undefined, 'Database id');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
    it('getDatabase', async () => {
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database.databaseId).to.eql(databaseId, 'Database Id');
    });
    it('updateDatabase', async () => {
        const updateParameters: DatabaseUpdateParameters = {
            name: 'test-updated-databases'
        };
        await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(updateParameters.name).to.eql(database.name, 'Database name');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
    it.skip('backupDatabase', async () => {
        const response = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        expect(response.error).to.eql(undefined, 'Error message');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
    it.skip('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response.error).to.eql(undefined, 'Error message');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
});