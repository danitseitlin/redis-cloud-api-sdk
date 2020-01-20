import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../api';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from '../interfaces/database';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key',
    domain: 'qa-api.redislabs.com'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    const subscriptionId: number = -1;
    let databaseId: number = -1;
    it('getDatabases', async function() {
        const databases: any = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases['error']).not.to.eql('Not Found', 'Checking if there was no error');
    });
    it('createDatabase', async function() {
        const createParameters: CreateDatabaseParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase: any = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        const createdDatabaseId: number = createDatabase['resourceId'];
        expect(createdDatabaseId).gt(0, 'Checking if the the database id is greater than 0');
        databaseId = createdDatabaseId;
    });
    it('getDatabase', async function() {
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database['error']).not.to.eql('Not Found', 'Checking if the database exists');
    });
    it('updateDatabase', async function() {
        const updateParameters: UpdateDatabaseParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase: any = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        expect(updateDatabase['error']).eql(undefined, 'Checking if there is an error');
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(updateParameters['name']).eql(database['name'], 'Checking that the name of the database was changed as expected');
    });
    it('deleteDatabase', async function() {
        await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        const database: any = cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database['error']).eql('Not Found', 'Checking that the database was deleted');
    });
    it('backupDatabase', async function() {
        const response: any = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        console.log(response)
        expect(response['error']).eql(undefined, 'Checking that the backup was done successfully');
    });
    it('importIntoDatabase', async function() {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['my-ftp-import-url']
        };
        const response: any = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response['error']).eql(undefined, 'Checking that the backup was done successfully');
    });
});