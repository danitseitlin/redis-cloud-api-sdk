import { expect } from 'chai';
import { CloudAPISDK } from '../../src/api';
import { loadArguments } from '../helpers';

const testArguments = loadArguments();

const cloudAPIClient = new CloudAPISDK({
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
    domain: testArguments.ENVIRONMENT
});
describe('Cleanup', async function() {
    this.timeout(10 * 60 * 1000);
    
    it('Resources cleanup', async () => {
        let subscriptions = await cloudAPIClient.getSubscriptions();
        for(const subscription of subscriptions) {
            console.log(`=== Removing subscription ${subscription.id} ===`);
            let databases = await cloudAPIClient.getDatabases(subscription.id);
            if(subscription.status !== 'error') {
                for(const database of databases) {
                    const databaseId = database.databaseId;
                    console.log(`=== Removing database ${databaseId} ===`);
                    await cloudAPIClient.deleteDatabase(subscription.id, databaseId);
                    await cloudAPIClient.waitForDatabaseStatus(subscription.id, databaseId, 404);
                }
                databases = await cloudAPIClient.getDatabases(subscription.id);
                expect(databases.response.data.message).to.eql(`Subscription ${subscription.id}: no databases found`, `Database non-existence for subscription ${subscription.id}`);
            }
            await cloudAPIClient.deleteSubscription(subscription.id);
            await cloudAPIClient.waitForSubscriptionStatus(subscription.id, 404);
        }
        subscriptions = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.length).to.eql(0, 'Subscriptions count');
    });

    it('Cloud account cleanup', async () => {
        let cloudAccounts = await cloudAPIClient.getCloudAccounts();
        for(const cloudAccount of cloudAccounts) {
            if(cloudAccount.id !== 1) {
                console.log(`=== Removing cloud account ${cloudAccount.id} ===`);
                await cloudAPIClient.deleteCloudAccount(cloudAccount.id);
                await cloudAPIClient.waitForCloudAccountStatus(cloudAccount.id, 404);
            }
        }
        cloudAccounts = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(1, 'Cloud accounts count');
    });
});