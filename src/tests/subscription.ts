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
    let vpcPeeringId: number = -1;
    let vpcId: string = '';
    let vpcCidr: string = '';
    const paymentMethods: any = await cloudAPIClient.getPaymentMethods()['paymentMethods'];
    const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
    const cloudAccount: any = cloudAccounts.find(account => account['id'] !== 1);
    it('createSubscription', async function() {
        
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
        expect(createResponse['error']).not(undefined, `Error was found ${createResponse['error']}`);
        subscriptionId = createResponse['resourceId'];
    });
    it('getSubscriptions', async function() {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        const subscription: any = subscriptions.find(subscription => subscription['id'] === subscriptionId);
        expect(subscription['error']).not(undefined, `Error was found ${subscription['error']}`);
    }); 
    it('getSubscription', async function() {
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['error']).not(undefined, `Error was found ${subscription['error']}`);
    }); 
    it('updateSubscription', async function() {
        const updateResponse: any = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: 'updated-subscription'
        });
        expect(updateResponse['error']).eql(undefined, `Error was found ${updateResponse['error']}`);
    }); 
    it('deleteSubscription', async function() {
        await cloudAPIClient.deleteSubscription(subscriptionId);
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['error']).eql('Not Found', 'Subscription was not removed');
    }); 
    it('getCidrWhitelistss', async function() {
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        expect(cidrWhitelists['error']).eql(undefined, `Error was found ${cidrWhitelists['error']}`);
    }); 
    it('updateCidrWhitelists', async function() {
        const updateResponse: any = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: ['192.168.1.0']
        });
        expect(updateResponse['error']).eql(undefined, `Error was found ${updateResponse['error']}`);
    }); 
    it('getSubscriptionVpcPeerings', async function() {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings['error']).eql(undefined, `Error was found ${subscriptionVpcPeerings['error']}`);
    }); 
    it('createSubscriptionVpcPeering', async function() {
        const createResponse: any = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: cloudAccount['id'],
            vpcCidr: vpcCidr,
            vpcId: vpcId
        });
        vpcPeeringId = createResponse['resourceId'];
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings.find(element => element.id === vpcPeeringId);
        expect(subscriptionVpcPeering).eql(undefined, 'Subscription vpc was not created');
    }); 
    it('deleteSubscriptionVpcPeering', async function() {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings.find(element => element.id === vpcPeeringId);
        expect(subscriptionVpcPeering).eql(undefined, 'Subscription vpc peering was not removed');
    }); 
  });