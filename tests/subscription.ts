import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionStatus, DatabaseStatus, SubscriptionVpcPeeringStatus } from '../src/api';
import { CreateSubscriptionParameters } from '../src/interfaces/subscription';
import { TEST_CONFIG } from './config';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_CONFIG.API_ACCESS_KEY,
    secretKey: TEST_CONFIG.API_SECRET_KEY,
    domain: TEST_CONFIG.ENVIRONMENT
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing subscription', async function() {
    this.timeout(1000 * 60 * 60);
    let subscriptionId: number = -1;
    let vpcPeeringId: number = -1;
    it('createSubscription', async () => {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        const paymentMethod: any = paymentMethods[0];
        const cloudAccount: any = cloudAccounts.find((cloudAccount: any) => cloudAccount['id'] !== 1);
        const createParameters: CreateSubscriptionParameters = {
            paymentMethodId: paymentMethod['id'],
            cloudProviders: [{
                cloudAccountId: cloudAccount['id'],
                regions: [{
                    region: 'us-east-1',
                    networking: {
                        deploymentCIDR: '192.168.1.0/24'
                    }
                }]
            }],
            databases: [{
                name: 'database',
                memoryLimitInGb: 5
            }]
        };
        const createResponse: any = await cloudAPIClient.createSubscription(createParameters);
        expect(createResponse['error']).to.eql(undefined, `Error was found ${createResponse['error']}`);
        subscriptionId = createResponse['resourceId'];
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
    });
    it('getSubscriptions', async () => {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        const subscription: any = subscriptions.find((subscription: any) => subscription['id'] === subscriptionId);
        expect(subscription['id']).to.eql(subscriptionId, `Error was found ${subscription['error']}`);
    }); 
    it('getSubscription', async () => {
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['error']).not.to.eql(undefined, `Error was found ${subscription['error']}`);
    }); 
    it('updateSubscription', async () => {
        const updateResponse: any = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: 'updated-subscription'
        });
        expect(updateResponse['error']).to.eql(undefined, `Error was found ${updateResponse['error']}`);
    }); 
    it('getCidrWhitelistss', async () => {
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        expect(cidrWhitelists['error']).to.eql(undefined, `Error was found ${cidrWhitelists['error']}`);
    }); 
    it('updateCidrWhitelists', async () => {
        const updateResponse: any = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: ['192.168.20.0/24']
        });
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        expect(updateResponse['error']).to.eql(undefined, `Error was found ${updateResponse['error']}`);
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings['error']).to.eql(undefined, `Error was found ${subscriptionVpcPeerings['error']}`);
    }); 
    it('createSubscriptionVpcPeering', async () => {
        const createResponse: any = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: TEST_CONFIG.VPC_PEERING_AWS_ACCOUNT_ID,
            vpcCidr: TEST_CONFIG.VPC_PEERING_CIDR,
            vpcId: TEST_CONFIG.VPC_PEERING_ID
        });
        vpcPeeringId = createResponse['resourceId'];
        await cloudAPIClient.waitForSubscriptionVpcPeeringStatus(subscriptionId, vpcPeeringId, SubscriptionVpcPeeringStatus.active);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings['resource']['peerings'][0]).gt(0, 'Subscription vpc was not created');
    }); 
    it('deleteSubscriptionVpcPeering', async () => {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings['resource']['peerings'].find((vpcPeering: any) => vpcPeering['id'] === vpcPeeringId);
        expect(subscriptionVpcPeering).to.eql(undefined, 'Subscription vpc peering was not removed');
    });
    it('deleteSubscription', async () => {
        const databases = await cloudAPIClient.getDatabases(subscriptionId);
        for(let i = 0; i < databases.length; i++) {
            const databaseId: number = databases[i]['databaseId'];
            await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
            await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
            const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
            expect(database['error']).to.eql('Not Found', 'Checking that the database was deleted');
        }
        await cloudAPIClient.deleteSubscription(subscriptionId);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.deleted);
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['error']).to.eql('Not Found', 'Subscription was not removed');
    }); 
  });