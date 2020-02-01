import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionStatus } from '../src/api';
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
    const vpcId: string = 'subscription-vpc-id';
    const vpcCidr: string = 'subscription-vpc-cidr';
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
    it('getSubscriptions', async () => {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        const subscription: any = subscriptions.find((subscription: any) => subscription['id'] === subscriptionId);
        expect(subscription['error']).not.to.eql(undefined, `Error was found ${subscription['error']}`);
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
    it('deleteSubscription', async () => {
        await cloudAPIClient.deleteSubscription(subscriptionId);
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['error']).to.eql('Not Found', 'Subscription was not removed');
    }); 
    it('getCidrWhitelistss', async () => {
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        expect(cidrWhitelists['error']).to.eql(undefined, `Error was found ${cidrWhitelists['error']}`);
    }); 
    it('updateCidrWhitelists', async () => {
        const updateResponse: any = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: ['192.168.1.0']
        });
        expect(updateResponse['error']).to.eql(undefined, `Error was found ${updateResponse['error']}`);
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings['error']).to.eql(undefined, `Error was found ${subscriptionVpcPeerings['error']}`);
    }); 
    it('createSubscriptionVpcPeering', async () => {
        const createResponse: any = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: cloudAccount['id'],
            vpcCidr: vpcCidr,
            vpcId: vpcId
        });
        vpcPeeringId = createResponse['resourceId'];
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings.find((vpcPeering: any) => vpcPeering['id'] === vpcPeeringId);
        expect(subscriptionVpcPeering).to.eql(undefined, 'Subscription vpc was not created');
    }); 
    it('deleteSubscriptionVpcPeering', async () => {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings.find((vpcPeering: any) => vpcPeering['id'] === vpcPeeringId);
        expect(subscriptionVpcPeering).to.eql(undefined, 'Subscription vpc peering was not removed');
    }); 
  });