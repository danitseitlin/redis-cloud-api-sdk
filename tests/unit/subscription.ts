import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { cliArguments } from 'cli-argument-parser';
import { MockServer } from 'dmock-server';

const server = new MockServer({
    hostname: cliArguments.ENVIRONMENT,
    port: parseInt(cliArguments.PORT),
    routes: 'tests/mockers/subscription.json'
});

const cloudAPIClient = new CloudAPISDK({
    protocol: 'http',
    domain: `${cliArguments.ENVIRONMENT}:${cliArguments.PORT}`,
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
});

describe('Testing subscription', async function() {
    this.timeout(10 * 60 * 60);
    const subscriptionId = 1;
    const vpcPeeringId = 1;
    before(async () => {
        server.start();
    });

    after(async () => {
        server.stop();
    });

    it('createSubscription', async () => {
        const response = await cloudAPIClient.createSubscription({
            dryRun: false,
            paymentMethodId: 123,
            cloudProviders: [{
                cloudAccountId: 456,
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
        expect(response.resourceId).to.eql(subscriptionId, 'Subscription id');
    });
    it('getSubscriptions', async () => {
        const subscriptions = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.length).to.eql(1, 'Subscriptions count');
    }); 
    it('getSubscription', async () => {
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription.id).to.eql(1, 'Subscription id');
    }); 
    it('updateSubscription', async () => {
        const response = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: 'updated-subscription'
        });
        expect(response.resourceId).to.eql(1, 'Subscription id');
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists = await cloudAPIClient.getSubscriptionCidrWhitelist(subscriptionId);
        expect(cidrWhitelists.cidr_ips.length).to.eql(1, 'Cidr whitelists count');
    }); 
    it('updateCidrWhitelists', async () => {
        const response = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: ['192.168.20.0/24']
        });
        expect(response.resourceId).to.eql(1, 'Subscription id');
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings.length).to.eql(1, 'Vpc Peerings count');
    }); 
    it('createSubscriptionVpcPeering', async () => {
        const response = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: 'aws-account-id',
            vpcCidr: 'vpc-cidr',
            vpcId: 'vpc-id'
        });
        expect(response.resourceId).to.eql(1, 'Subscription id');
    }); 
    it('deleteSubscriptionVpcPeering', async () => {
        const response = await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        expect(response.resourceId).to.eql(1, 'Subscription id');
    });
});
