import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { loadArguments } from '../helpers';

const testArguments = loadArguments();

const cloudAPIClient = new CloudAPISDK({
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
    domain: testArguments.ENVIRONMENT
});
describe('Testing database', async function() {
    this.timeout(60 * 60 * 1000);
    let subscriptionId = -1;
    let databaseId = -1;
    it('getSubscription', async () => {
        subscriptionId = (await cloudAPIClient.getSubscriptions())[0].id;
    });
    it('getDatabases', async () => {
        const databases = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases.length).to.eql(1, 'Database list length');
    });
    it('createDatabase', async () => {
        const createDatabase = await cloudAPIClient.createDatabase(subscriptionId, {
            name: 'test-database',
            memoryLimitInGb: 10.0
        });
        const id = createDatabase.resourceId;
        databaseId = id;
        expect(databaseId).not.to.eql(undefined, 'Database id');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, id, 'active');
        const database = await cloudAPIClient.getDatabase(subscriptionId, id);
        expect(database.status).eql('active', 'Database status');
    });
    it('getDatabase', async () => {
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database.databaseId).to.eql(databaseId, 'Database Id');
    });
    it('updateDatabase', async () => {
        await cloudAPIClient.updateDatabase(subscriptionId, databaseId, {
            name: 'test-updated-databases'
        });
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
        const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect('test-updated-databases').to.eql(database.name, 'Database name');
    });
    it.skip('backupDatabase', async () => {
        const response = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
        expect(response.error).to.eql(undefined, 'Error message');
    });
    it.skip('importIntoDatabase', async () => {
        const response = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        });
        expect(response.error).to.eql(undefined, 'Error message');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
});