import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../api';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from '../interfaces/database';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    this.timeout(1000 * 60 * 60);
    const subscriptionId: number = -1;
    let databaseId: number = -1;
    it('getDatabases', async () => {
        const databases: any = await cloudAPIClient.getDatabases(subscriptionId);
        expect(databases['error']).not.to.eql('Not Found', 'Checking if there was no error');
    });
    it('createDatabase', async () => {
        const createParameters: CreateDatabaseParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase: any = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        const createdDatabaseId: number = createDatabase['resourceId'];
        expect(createdDatabaseId).gt(0, 'Checking if the the database id is greater than 0');
        databaseId = createdDatabaseId;
    });
    it('getDatabase', async () => {
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database['error']).not.to.eql('Not Found', 'Checking if the database exists');
    });
    it('updateDatabase', async () => {
        const updateParameters: UpdateDatabaseParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase: any = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        expect(updateDatabase['error']).to.eql(undefined, 'Checking if there is an error');
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(updateParameters['name']).to.eql(database['name'], 'Checking that the name of the database was changed as expected');
    });
    it('deleteDatabase', async () => {
        await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        const database: any = cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database['error']).to.eql('Not Found', 'Checking that the database was deleted');
    });
    it('backupDatabase', async () => {
        const response: any = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        console.log(response)
        expect(response['error']).to.eql(undefined, 'Checking that the backup was done successfully');
    });
    it('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response: any = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response['error']).to.eql(undefined, 'Checking that the backup was done successfully');
    });
});