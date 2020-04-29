import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { loadArguments } from '../helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Cleanup', async function() {
    this.timeout(10 * 60 * 1000);
    
    it('Resources cleanup', async () => {
        let subscriptions = await cloudAPIClient.getSubscriptions();
        for(const subscription of subscriptions) {
            const subscriptionId: number = subscription.id;
            console.log(`=== Starting cleanup for subscription ${subscriptionId} ===`);
            let databases = await cloudAPIClient.getDatabases(subscriptionId);
            if(subscription.status !== 'error') {
                for(const database of databases) {
                    const databaseId: number = database.databaseId;
                    console.log(`=== Starting cleanup for database ${databaseId} ===`);
                    await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
                    await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, 404);
                    console.log(`=== Finished cleanup for database ${databaseId} ===`);
                }
                databases = await cloudAPIClient.getDatabases(subscriptionId);
                expect(databases.response.data.message).to.eql(`Subscription ${subscriptionId}: no databases found`, `Database non-existence for subscription ${subscriptionId}`);
            }
            console.log(await cloudAPIClient.deleteSubscription(subscriptionId));
            await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, 404);
            console.log(`=== Finished cleanup for subscription ${subscriptionId} ===`);
        }
        subscriptions = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.length).to.eql(0, 'Subscriptions count');
    });

    it('Cloud account cleanup', async () => {
        let cloudAccounts = await cloudAPIClient.getCloudAccounts();
        for(const cloudAccount of cloudAccounts) {
            const id = cloudAccount.id;
            if(id !== 1) {
                console.log(`=== Starting cleanup for cloud account ${id} ===`);
                await cloudAPIClient.deleteCloudAccount(id);
                await cloudAPIClient.waitForCloudAccountStatus(id, 404);
                const cloudAccount = await cloudAPIClient.getCloudAccount(id);
                expect(cloudAccount.status).to.not.eql('active', 'Cloud account status');
                console.log(`=== Finished cleanup for cloud account ${id} ===`);
            }
        }
        cloudAccounts = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(1, 'Cloud accounts count');
    });
});