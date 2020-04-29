import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { CreateSubscriptionParameters } from '../../src/types/parameters/subscription';
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const TEST_ARGUMENTS = loadArguments();
const server = new MockServer({
    hostname: TEST_ARGUMENTS.ENVIRONMENT,
    port: parseInt(TEST_ARGUMENTS.PORT),
    routes: [{
        path: '/v1/payment-methods',
        method: 'get',
        response: {
            paymentMethods: [{
                id: 1
            }]
        }
    },{
        path: '/v1/subscriptions',
        method: 'post',
        response: [{
            taskId: 1
        }]
    },{
        path: '/v1/subscriptions',
        method: 'get',
        response: {
            subscriptions: [{
                id: 1
            }]
        }
    },{
        path: '/v1/subscriptions/1',
        method: 'get',
        response: {
            subscriptions: [{
                id: 1
            }]
        }
    },{
        path: '/v1/subscriptions/1',
        method: 'put',
        response: {
            subscriptions: [{
                id: 1
            }]
        }
    },{
        path: '/v1/subscriptions/1/cidr',
        method: 'get',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/cidr',
        method: 'put',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/peerings',
        method: 'get',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/peerings',
        method: 'post',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/subscriptions/1/peerings/1',
        method: 'delete',
        response: {
            taskId: 1
        }
    },{
        path: '/v1/cloud-accounts/1',
        method: 'get',
        response: {
            id: 1,
            name: 'My cloud account'
        }
    },{
        path: '/v1/tasks/1',
        method: 'get',
        response: {
            response: {
                status: 'processing-completed',
                resource: {
                    cidr_ips: [],
                    peerings: []
                }
            }
        }
    }]
});

const cloudAPISDKParameters: CloudAPISDKParameters = {
    protocol: 'http',
    domain: `${TEST_ARGUMENTS.ENVIRONMENT}:${TEST_ARGUMENTS.PORT}`,
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
}

const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing subscription', async function() {
    this.timeout(10 * 60 * 60);
    let subscriptionId: number = 1;
    let vpcPeeringId: number = 1;
    let cloudAccountId: number = 1;
    before(async () => {
        server.start();
    });

    after(async () => {
        server.stop();
    });

    it('createSubscription', async () => {
        const paymentMethods = await cloudAPIClient.getPaymentMethods();
        const paymentMethod = paymentMethods[0];
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId)
        const createParameters: CreateSubscriptionParameters = {
            dryRun: false,
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
        const createResponse = await cloudAPIClient.createSubscription(createParameters);
        expect(createResponse.message).to.eql(undefined, 'Error message existence');
        expect(createResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getSubscriptions', async () => {
        const subscriptions = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.message).to.eql(undefined, 'Error message existence');
        expect(subscriptions.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getSubscription', async () => {
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription.message).not.to.eql(`Subscription ${subscriptionId} not found`, 'Error message type');
    }); 
    it('updateSubscription', async () => {
        const subscriptionName: string = 'updated-subscription';
        const updateResponse = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: subscriptionName
        });
        expect(updateResponse.message).to.eql(undefined, 'Error message existence');
        expect(updateResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists = await cloudAPIClient.getSubscriptionCidrWhitelist(subscriptionId);
        expect(cidrWhitelists.cidr_ips).to.eql([], 'The CIDR whitelist existence');
    }); 
    it('updateCidrWhitelists', async () => {
        const updatedCidrIps: string[] = ['192.168.20.0/24'];
        const updateResponse = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        expect(updateResponse.message).to.eql(undefined, 'Error message existence');
        expect(updateResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings).to.not.eql(undefined, 'The VPC peering existence');
    }); 
    it('createSubscriptionVpcPeering', async () => {
        const createResponse = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: TEST_ARGUMENTS.VPC_PEERING_AWS_ACCOUNT_ID,
            vpcCidr: TEST_ARGUMENTS.VPC_PEERING_CIDR,
            vpcId: TEST_ARGUMENTS.VPC_PEERING_ID
        });
        expect(createResponse.message).to.eql(undefined, 'Error message existence');
        expect(createResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('deleteSubscriptionVpcPeering', async () => {
        const response = await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        expect(response.message).to.eql(undefined, 'Error message existence');
        expect(response.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
});
