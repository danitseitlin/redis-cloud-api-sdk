import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { cliArguments } from 'cli-argument-parser';

const client = new CloudAPISDK({
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    domain: cliArguments.ENVIRONMENT,
    debug: (cliArguments.debug === 'true') ? true: false
});
describe('Cleanup', async function() {
    this.timeout(10 * 60 * 1000);
    
    it('Resources cleanup', async () => {
        let subscriptions = await client.getSubscriptions();
        for(const subscription of subscriptions) {
            console.log(`=== Removing subscription ${subscription.id} ===`);
            let databases = await client.getDatabases(subscription.id);
            if(subscription.status !== 'error') {
                for(const database of databases) {
                    const databaseId = database.databaseId;
                    console.log(`=== Removing database ${databaseId} ===`);
                    await client.deleteDatabase(subscription.id, databaseId);
                    await client.waitForDatabaseStatus(subscription.id, databaseId, 404);
                }
                databases = await client.getDatabases(subscription.id);
                expect(databases.response.data.message).to.eql(`Subscription ${subscription.id}: no databases found`, `Database non-existence for subscription ${subscription.id}`);
            }
            await client.deleteSubscription(subscription.id);
            await client.waitForSubscriptionStatus(subscription.id, 404);
        }
        subscriptions = await client.getSubscriptions();
        expect(subscriptions.length).to.eql(0, 'Subscriptions count');
    });

    it('Cloud account cleanup', async () => {
        let cloudAccounts = await client.getCloudAccounts();
        for(const cloudAccount of cloudAccounts) {
            if(cloudAccount.id !== 1) {
                console.log(`=== Removing cloud account ${cloudAccount.id} ===`);
                await client.deleteCloudAccount(cloudAccount.id);
                await client.waitForCloudAccountStatus(cloudAccount.id, 404);
            }
        }
        cloudAccounts = await client.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(1, 'Cloud accounts count');
    });
});