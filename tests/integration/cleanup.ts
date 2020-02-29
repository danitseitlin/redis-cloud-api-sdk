import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, DatabaseStatus, SubscriptionStatus, CloudAccountStatus } from '../../src/api';
import { loadArguments } from '../helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Cleanup', async function() {
    this.timeout(1000 * 60 * 60);
    
    it('Resources cleanup', async () => {
        let subscriptions = await cloudAPIClient.getSubscriptions();
        for(let i = 0; i < subscriptions.length; i++) {
            const subscriptionId: number = subscriptions[i]['id'];
            let databases = await cloudAPIClient.getDatabases(subscriptionId);
            for(let j = 0; j < databases.length; j++) {
                const databaseId: number = databases[j]['databaseId'];
                await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
                await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
            }
            databases = await cloudAPIClient.getDatabases(subscriptionId);
            expect(subscriptions.length).to.eql(0, `Databases count for subsription ${subscriptionId}`);
            await cloudAPIClient.deleteSubscription(subscriptionId);
            await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.deleted);

        }
        subscriptions = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.length).to.eql(0, 'Subscriptions count');
    });

    it('Cloud account cleanup', async () => {
        let cloudAccounts = await cloudAPIClient.getCloudAccounts();
        for(let i = 0; i < cloudAccounts.length; i++) {
            const cloudAccountId = cloudAccounts[i]['id'];
            if(cloudAccountId !== 1) {
                await cloudAPIClient.deleteCloudAccount(cloudAccountId);
                await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.deleted);
                const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
                expect(cloudAccount['status']).to.not.eql(CloudAccountStatus.active, 'Cloud Account Status');
            }
        }
        cloudAccounts = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(1, 'Cloud accounts count');
    });
});