import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { cliArguments } from 'cli-argument-parser';

const client = new CloudAPISDK({
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    domain: cliArguments.ENVIRONMENT,
    debug: (cliArguments.debug === 'true') ? true: false
});
describe('Testing database', async function() {
    this.timeout(60 * 60 * 1000);
    let subscriptionId = -1;
    let databaseId = -1;
    it('getSubscription', async () => {
        subscriptionId = (await client.getSubscriptions())[0].id;
    });
    it('getDatabases', async () => {
        const databases = await client.getDatabases(subscriptionId);
        expect(databases.length).to.eql(1, 'Database list length');
    });
    it('createDatabase', async () => {
        const createDatabase = await client.createDatabase(subscriptionId, {
            name: 'test-database',
            memoryLimitInGb: 10.0
        });
        const id = createDatabase.resourceId;
        databaseId = id;
        expect(databaseId).not.to.eql(undefined, 'Database id');
        await client.waitForDatabaseStatus(subscriptionId, id, 'active');
        const database = await client.getDatabase(subscriptionId, id);
        expect(database.status).eql('active', 'Database status');
    });
    it('getDatabase', async () => {
        const database = await client.getDatabase(subscriptionId, databaseId);
        expect(database.databaseId).to.eql(databaseId, 'Database Id');
    });
    it('updateDatabase', async () => {
        await client.updateDatabase(subscriptionId, databaseId, {
            name: 'test-updated-databases'
        });
        await client.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
        const database = await client.getDatabase(subscriptionId, databaseId);
        expect('test-updated-databases').to.eql(database.name, 'Database name');
    });
    it.skip('backupDatabase', async () => {
        const response = await client.backupDatabase(subscriptionId, databaseId);
        await client.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
        expect(response.error).to.eql(undefined, 'Error message');
    });
    it.skip('importIntoDatabase', async () => {
        const response = await client.importIntoDatabase(subscriptionId, databaseId, {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        });
        expect(response.error).to.eql(undefined, 'Error message');
        await client.waitForDatabaseStatus(subscriptionId, databaseId, 'active');
    });
});