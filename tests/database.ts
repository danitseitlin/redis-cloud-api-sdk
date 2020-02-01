import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionStatus, DatabaseStatus } from '../src/api';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from '../src/interfaces/database';
import { CreateSubscriptionParameters } from '../src/interfaces/subscription';
import { TEST_CONFIG } from './config';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_CONFIG.API_ACCESS_KEY,
    secretKey: TEST_CONFIG.API_SECRET_KEY
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    this.timeout(1000 * 60 * 60);
    let subscriptionId: number = -1;
    let databaseId: number = -1;
    const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
    const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
    const paymentMethod: any = paymentMethods[0];
    const cloudAccount: any = cloudAccounts.find((cloudAccount: any) => cloudAccount['id'] !== 1);
    it('createSubscription', async () => {
        const createParameters: CreateSubscriptionParameters = {
            paymentMethodId: paymentMethod['id'],
            cloudProviders: [{
                cloudAccountId: cloudAccount['id'],
                regions: [{
                    region: 'us-east-1',
                    networking: {
                        deploymentCIDR: '192.168.1.0'
                    }
                }]
            }],
            databases: [{
                name: 'database',
                memoryLimitInGb: 5
            }]
        };
        const createResponse: any = await cloudAPIClient.createSubscription(createParameters);
        expect(createResponse['error']).not.to.eql(undefined, `Error was found ${createResponse['error']}`);
        subscriptionId = createResponse['resourceId'];
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
    });
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
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
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
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
    it('deleteDatabase', async () => {
        await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
        const database: any = cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database['error']).to.eql('Not Found', 'Checking that the database was deleted');
        
    });
    it('backupDatabase', async () => {
        const response: any = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        expect(response['error']).to.eql(undefined, 'Checking that the backup was done successfully');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
    it('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response: any = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response['error']).to.eql(undefined, 'Checking that the backup was done successfully');
        await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
});