import { expect } from 'chai';
import { cliArguments } from 'cli-argument-parser';
import { CloudAPISDK } from '../../api';
import { SubscriptionVpcPeering } from '../../types/responses/subscription';

const client: CloudAPISDK = new CloudAPISDK({
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    domain: cliArguments.ENVIRONMENT,
    debug: (cliArguments.debug === 'true') ? true: false
});
describe('Testing subscription', async function() {
    this.timeout(60 * 60 * 1000);
    let subscriptionId = -1;
    let vpcPeeringId = -1;
    let cloudAccountId = -1;
    it('createCloudAccount', async () => {
        const response = await client.createCloudAccount({
            name: 'Cloud account',
            accessKeyId: cliArguments.AWS_ACCESS_ID,
            accessSecretKey: cliArguments.AWS_SECRET_KEY,
            consoleUsername: 'console-username',
            consolePassword: 'console-password',
            signInLoginUrl: 'sign-in-login-url'
        });
        cloudAccountId = response.resourceId;
        expect(cloudAccountId).not.to.eql(undefined, 'Cloud account id');
        await client.waitForCloudAccountStatus(cloudAccountId, 'active');
        const cloudAccount = await client.getCloudAccount(cloudAccountId);
        expect(cloudAccount.status).to.eql('active', 'Cloud account status');
    });
    it('createSubscription', async () => {
        const paymentMethod = (await client.getPaymentMethods())[0];
        const cloudAccount = await client.getCloudAccount(cloudAccountId)
        const createResponse = await client.createSubscription({
            paymentMethodId: paymentMethod.id,
            cloudProviders: [{
                cloudAccountId: cloudAccount.id,
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
        });
        subscriptionId = createResponse.resourceId;
        expect(subscriptionId).not.to.eql(undefined, 'Subscription id');
        await client.waitForSubscriptionStatus(subscriptionId, 'active');
        const subscription = await client.getSubscription(subscriptionId);
        expect(subscription.status).to.eql('active', 'Subscription status');
    });
    it('getSubscriptions', async () => {
        const subscriptions = await client.getSubscriptions();
        expect(subscriptions.length).to.eql(1, 'Subscriptions count');
    }); 
    it('getSubscription', async () => {
        const subscription = await client.getSubscription(subscriptionId);
        expect(subscription.id).to.eql(subscriptionId, 'Subscription id');
    }); 
    it('updateSubscription', async () => {
        const subscriptionName = 'updated-subscription';
        await client.updateSubscription(subscriptionId, {
            name: subscriptionName
        });
        await client.waitForSubscriptionStatus(subscriptionId, 'active');
        const subscription = await client.getSubscription(subscriptionId);
        expect(subscription.name).to.eql(subscriptionName, 'Subscription name');
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists = await client.getSubscriptionCidrWhitelist(subscriptionId);
        expect(cidrWhitelists.cidr_ips).to.eql([], 'Subscription cidr ips');
    }); 
    it.skip('updateCidrWhitelists', async () => {
        const updatedCidrIps = ['192.168.1.0/24'];
        await client.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        await client.waitForSubscriptionStatus(subscriptionId, 'active');
        const cidrWhitelists = await client.getSubscriptionCidrWhitelist(subscriptionId);
        expect(cidrWhitelists.cidr_ips).to.eql(updatedCidrIps, 'Subscription cidr ips');
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings = await client.getVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings).to.eql([], 'Subscription peerings list');
    }); 
    it.skip('createSubscriptionVpcPeering', async () => {
        const createResponse = await client.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: cliArguments.VPC_PEERING_AWS_ACCOUNT_ID,
            vpcCidr: cliArguments.VPC_PEERING_CIDR,
            vpcId: cliArguments.VPC_PEERING_ID
        });
        vpcPeeringId = createResponse.resourceId;
        expect(vpcPeeringId).not.to.eql(undefined, 'VPC Peering id');
        await client.waitForVpcPeeringStatus(subscriptionId, vpcPeeringId, 'active');
        const subscriptionVpcPeerings = await client.getVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings.length).gt(0, 'The subscription peerings list count');
    }); 
    it.skip('deleteSubscriptionVpcPeering', async () => {
        await client.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings = await client.getVpcPeerings(subscriptionId);
        const subscriptionVpcPeering = subscriptionVpcPeerings.find((vpcPeering: SubscriptionVpcPeering) => vpcPeering.id === vpcPeeringId);
        expect(subscriptionVpcPeering).not.to.eql(undefined, 'Subscription peering existence');
    });
  });