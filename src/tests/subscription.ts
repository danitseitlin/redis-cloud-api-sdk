import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../api';
import { CreateSubscriptionParameters } from '../interfaces/subscription';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing subscription', async function() {
    let subscriptionId: number = -1;
    it('createSubscription', async function() {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods()['paymentMethods'];
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        const cloudAccount: any = cloudAccounts.find(account => account['id'] !== 1);
        const createParameters: CreateSubscriptionParameters = {
            dryRun: true,
            paymentMethodId: paymentMethods[0]['id'],
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
        expect(createResponse['error']).not(undefined);
        subscriptionId = createResponse['resourceId'];
    });
    it('getSubscriptions', async function() {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        const subscription: any = subscriptions.find(subscription => subscription['id'] === subscriptionId);
        expect(subscription).not(undefined);
    }); 
    it('getSubscription', async function() {
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription).not(undefined);
    }); 
    it('updateSubscription', async function() {
        const updateResponse: any = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: 'updated-subscription'
        });
        expect(updateResponse['error']).eql(undefined);
    }); 
    it('deleteSubscription', async function() {
        
    }); 
    it('getCidrWhitelistss', async function() {
        
    }); 
    it('updateCidrWhitelists', async function() {
        
    }); 
    it('getSubscriptionVpcPeerings', async function() {
        
    }); 
    it('createSubscriptionVpcPeering', async function() {
        
    }); 
    it('deleteSubscriptionVpcPeering', async function() {
        
    }); 
  });