import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionStatus, DatabaseStatus, CloudAccountStatus } from '../../src/api';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from '../../src/interfaces/database';
import { CreateSubscriptionParameters } from '../../src/interfaces/subscription';
import { loadArguments } from '../helpers';
import { CreateCloudAccountParameters } from '../../src/interfaces/cloud-account';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}

const cloudAccountCredentials: CreateCloudAccountParameters = {
    name: 'My cloud account',
    accessKeyId: TEST_ARGUMENTS.AWS_ACCESS_ID,
    accessSecretKey: TEST_ARGUMENTS.AWS_SECRET_KEY,
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing databases', async function() {
    this.timeout(1000 * 60 * 60);
    let subscriptionId: number = -1;
    let databaseId: number = -1;
    let cloudAccountId: number = -1;
    // it('createCloudAccount', async () => {
    //     const response: any = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
    //     cloudAccountId = response['resourceId'];
    //     console.log(`=== cloudAccountId: ${cloudAccountId} ===`);
    //     expect(cloudAccountId).not.to.eql(undefined, `Cloud account id is ${cloudAccountId}`);
    //     await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.active);
    //     const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
    //     console.log(`============ Cloud account (${cloudAccountId}) ============`);
    //     console.log(cloudAccount);
    //     console.log(`===========================================================\n`);
    //     expect(cloudAccount['status']).to.eql(CloudAccountStatus.active, 'Cloud Account status');
    // });
    // it('createSubscription', async () => {
    //     const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
    //     const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
    //     const paymentMethod: any = paymentMethods[0];
    //     const cloudAccount: any = cloudAccounts.find((cloudAccount: any) => cloudAccount['id'] !== 1);
    //     const createParameters: CreateSubscriptionParameters = {
    //         paymentMethodId: paymentMethod['id'],
    //         cloudProviders: [{
    //             cloudAccountId: cloudAccount['id'],
    //             regions: [{
    //                 region: 'us-east-1',
    //                 networking: {
    //                     deploymentCIDR: '192.168.1.0/24'
    //                 }
    //             }]
    //         }],
    //         databases: [{
    //             name: 'database',
    //             memoryLimitInGb: 5
    //         }]
    //     };
    //     const createResponse: any = await cloudAPIClient.createSubscription(createParameters);
    //     expect(createResponse['error']).to.eql(undefined, `Error was found ${createResponse['error']}`);
    //     subscriptionId = createResponse['resourceId'];
    //     await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
    // });
    it('getDatabases', async () => {
        const databases: any = await cloudAPIClient.getDatabases(subscriptionId);
        console.log(databases);
        expect(databases.message).to.eql(`Subscription ${subscriptionId} not found`, 'Error message type');
        // expect(databases['error']).not.to.eql('Not Found', 'Checking if there was no error');
    });
    it('createDatabase', async () => {
        const createParameters: CreateDatabaseParameters = {
            name: 'test-database',
            memoryLimitInGb: 10.0
        };
        const createDatabase: any = await cloudAPIClient.createDatabase(subscriptionId, createParameters);
        // const createdDatabaseId: number = createDatabase['resourceId'];
        expect(createDatabase.message).to.eql(`Subscription ${subscriptionId} not found`, 'Error message type');
        // expect(createdDatabaseId).gt(0, 'Checking if the the database id is greater than 0');
        // databaseId = createdDatabaseId;
        // await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
    it('getDatabase', async () => {
        const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        expect(database.message).to.eql(`Database ${databaseId} not found`, 'Error message type');
        // expect(database['error']).not.to.eql('Not Found', 'Checking if the database exists');
    });
    it('updateDatabase', async () => {
        const updateParameters: UpdateDatabaseParameters = {
            name: 'test-updated-databases'
        };
        const updateDatabase: any = await cloudAPIClient.updateDatabase(subscriptionId, databaseId, updateParameters);
        expect(updateDatabase.message).to.eql(`Database ${databaseId} not found`, 'Error message type');
        // expect(updateDatabase['error']).to.eql(undefined, 'Checking if there is an error');
        // const database: any = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
        // expect(updateParameters['name']).to.eql(database['name'], 'Checking that the name of the database was changed as expected');
        // await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
    it('deleteDatabase', async () => {
        const deleteDatabaseResponse = await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
        // await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
        expect(deleteDatabaseResponse.message).to.eql(`Database ${databaseId} not found`, 'Error message type');
        // const database: any = cloudAPIClient.getDatabase(subscriptionId, databaseId);

        // expect(database['error']).to.eql('Not Found', 'Checking that the database was deleted');
        
    });
    it('backupDatabase', async () => {
        const response: any = await cloudAPIClient.backupDatabase(subscriptionId, databaseId);
        expect(response.message).to.eql(`Database ${databaseId} not found`, 'Error message type');

        // expect(response['error']).to.eql(undefined, 'Checking that the backup was done successfully');
        // await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
    it('importIntoDatabase', async () => {
        const importParameters: DatabaseImportParameters = {
            sourceType: 'ftp',
            importFromUri: ['ftp-import-url']
        };
        const response: any = await cloudAPIClient.importIntoDatabase(subscriptionId, databaseId, importParameters);
        expect(response.message).to.eql(`Database ${databaseId} not found`, 'Error message type');
        // expect(response['error']).to.eql(undefined, 'Checking that the import was done successfully');
        // await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
    });
});