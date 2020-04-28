import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { DatabaseCreationParameters, DatabaseUpdateParameters, DatabaseImportParameters } from '../../src/types/parameters/database';
import { loadArguments } from '../helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    this.timeout(60 * 60 * 1000);
    let subscriptionId: number = -1;
    let databaseId: number = -1;
    it('getSubscription', async () => {
        subscriptionId = (await cloudAPIClient.getSubscriptions())[0].id;
    });
    it('getDatabases', async () => {
        const databases = await cloudAPIClient.getDatabases(subscriptionId);
        console.log(databases)
        expect(databases.length).to.eql(1, 'Database list length');
    });
    it('createDatabase', async () => {
        const createParameters: DatabaseCreationParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        const createdDatabaseId: number = createDatabase['resourceId'];
        expect(createdDatabaseId).not.to.eql(undefined, 'Database id');
        databaseId = createdDatabaseId;
        console.log(`Database id: ${databaseId}`);
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
    it('getDatabase', async () => {
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        console.log(database)
        expect(database.databaseId).to.eql(databaseId, 'Database Id');
    });
    it('updateDatabase', async () => {
        const updateParameters: DatabaseUpdateParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        console.log(updateDatabase)
        expect(updateDatabase['error']).to.eql(undefined, 'error');
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(updateParameters['name']).to.eql(database['name'], 'Checking that the name of the database was changed as expected');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
    it.skip('deleteDatabase', async () => {
        await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, '404');
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database['error']).to.eql('Not Found', 'Checking that the database was deleted');
    });
    it.skip('backupDatabase', async () => {
        const response = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        console.log(response)
        expect(response['error']).to.eql(undefined, 'Checking that the backup was done successfully');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
    it.skip('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        console.log(response)
        expect(response['error']).to.eql(undefined, 'Checking that the import was done successfully');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
});