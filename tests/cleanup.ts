import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, DatabaseStatus, SubscriptionStatus, CloudAccountStatus } from '../src/api';
import { loadArguments } from './helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Cleanup', async function() {
    this.timeout(1000 * 60 * 60);
    
    it('Remove subscriptions', async () => {
        const subscriptions = await cloudAPIClient.getSubscriptions();
        for(let i = 0; i < subscriptions.length; i++) {
            const subscriptionId: number = subscriptions[i]['id'];
            const databases = await cloudAPIClient.getDatabases(subscriptionId);
            for(let j = 0; j < databases.length; j++) {
                const databaseId: number = databases[j]['databaseId'];
                const deleteDatabaseResponse: any = await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
                // if(TEST_ARGUMENTS.DEBUG) console.log(deleteDatabaseResponse);
                await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
                // const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
                // if(TEST_ARGUMENTS.DEBUG) console.log(database);
                // const error: any = database.find((error: any) => error['status'] !== undefined);  
                // if(TEST_ARGUMENTS.DEBUG) console.log(error);
                // expect(error['status']).to.eql('Not Found', 'Checking that the database was deleted');
            }
        
            const deleteSubscriptionResponse: any = await cloudAPIClient.deleteSubscription(subscriptionId);
            // if(TEST_ARGUMENTS.DEBUG) console.log(deleteSubscriptionResponse);
            await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.deleted);
            // const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
            // const error: any = subscription.find((error: any) => error['status'] !== undefined);  
            // if(TEST_ARGUMENTS.DEBUG) console.log(error);
            // expect(error['status']).to.eql('Not Found', 'Subscription was not removed');
        }
    });

    it('Remove cloud accounts', async () => {
        const cloudAccounts = await cloudAPIClient.getCloudAccounts();
        let cloudAccount = cloudAccounts.find(cloudAccount => cloudAccount['id'] !== -1);
        const cloudAccountId = cloudAccount['id'];
        await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.deleted);
        cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['status']).to.not.eql(CloudAccountStatus.active, 'Cloud Account Status');
    });
});