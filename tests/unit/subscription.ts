import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionStatus, DatabaseStatus, SubscriptionVpcPeeringStatus, CloudAccountStatus } from '../../src/api';
import { CreateSubscriptionParameters } from '../../src/interfaces/subscription';
import { loadArguments } from '../helpers';
import { CreateCloudAccountParameters } from '../../src/interfaces/cloud-account';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}
const cloudAccountCredentials: CreateCloudAccountParameters = {
    name: 'My cloud account',
    accessKeyId: TEST_ARGUMENTS.AWS_ACCESS_ID,
    accessSecretKey: TEST_ARGUMENTS.AWS_SECRET_KEY,
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing subscription', async function() {
    this.timeout(1000 * 60 * 60);
    let subscriptionId: number = -1;
    let vpcPeeringId: number = -1;
    let cloudAccountId: number = -1;
    it('createSubscription', async () => {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        const paymentMethod: any = paymentMethods[0];
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId)
        const createParameters: CreateSubscriptionParameters = {
            dryRun: true,
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
        expect(createResponse.message).to.eql(undefined, 'Error message existence');
        expect(createResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getSubscriptions', async () => {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.message).to.eql(undefined, 'Error message existence');
        expect(subscriptions.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getSubscription', async () => {
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription.message).not.to.eql(`Subscription ${subscriptionId} not found`, 'Error message type');
    }); 
    it('updateSubscription', async () => {
        const subscriptionName: string = 'updated-subscription';
        const updateResponse: any = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: subscriptionName
        });
        expect(updateResponse.message).to.eql(undefined, 'Error message existence');
        expect(updateResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        expect(cidrWhitelists).to.eql(undefined, 'The CIDR whitelist existence');
    }); 
    it('updateCidrWhitelists', async () => {
        const updatedCidrIps: string[] = ['192.168.20.0/24'];
        const updateResponse: any = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        expect(updateResponse.message).to.eql(undefined, 'Error message existence');
        expect(updateResponse.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings).to.eql(undefined, 'The VPC peering existence');
    }); 
    it('createSubscriptionVpcPeering', async () => {
        const createResponse: any = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
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
