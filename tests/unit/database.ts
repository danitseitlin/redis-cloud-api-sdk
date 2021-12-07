import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { cliArguments } from 'cli-argument-parser';
import { MockServer } from 'dmock-server';

const server = new MockServer({
    hostname: cliArguments.ENVIRONMENT,
    port: parseInt(cliArguments.PORT),
    routes: 'tests/mockers/database.json'
});

const client = new CloudAPISDK({
    protocol: 'http',
    domain: `${cliArguments.ENVIRONMENT}:${cliArguments.PORT}`,
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    debug: true
});

describe('Testing databases', async function() {
    this.timeout(10 * 60 * 60);
    const subscriptionId = 1;
    const databaseId = 1;
    before(async () => {
        server.start();
    });
    after(async () => {
        server.stop();
    });
    it('getDatabases', async () => {
        const databases = await client.getDatabases(subscriptionId);
        expect(databases.length).to.eql(1, 'Databases count')
    });
    it('createDatabase', async () => {
        const createDatabase = await client.createDatabase(subscriptionId, {
            name: 'test-database',
            memoryLimitInGb: 10.0
        });
        expect(createDatabase.resourceId).to.eql(1, 'Database id');
    });
    it('getDatabase', async () => {
        const database = await client.getDatabase(subscriptionId, databaseId);
        expect(database.databaseId).to.eql(1, 'Database id');
        expect(database.name).to.eql('First database', 'Database name');
    });
    it('updateDatabase', async () => {
        const updateDatabase = await client.updateDatabase(subscriptionId, databaseId, {
            name: 'test-updated-databases'
        });
        expect(updateDatabase.resourceId).to.eql(1, 'Database id');
    });
    it('deleteDatabase', async () => {
        const deleteDatabaseResponse = await client.deleteDatabase(subscriptionId, databaseId);
        expect(deleteDatabaseResponse.resourceId).to.eql(1, 'Database id');
    });
    it('backupDatabase', async () => {
        const response = await client.backupDatabase(subscriptionId, databaseId);
        expect(response.resourceId).to.eql(1, 'Database id');
    });
    it('importIntoDatabase', async () => {
        const response = await client.importIntoDatabase(subscriptionId, databaseId, {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        });
        expect(response.resourceId).to.eql(1, 'Database id');
    });
});