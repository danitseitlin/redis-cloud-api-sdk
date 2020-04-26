import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters, SubscriptionVpcPeeringStatus } from '../../src/api';
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
    name: 'Cloud account',
    accessKeyId: TEST_ARGUMENTS.AWS_ACCESS_ID,
    accessSecretKey: TEST_ARGUMENTS.AWS_SECRET_KEY,
    consoleUsername: 'console-username',
    consolePassword: 'console-password',
    signInLoginUrl: 'sign-in-login-url'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing subscription', async function() {
    this.timeout(60 * 60 * 1000);
    let subscriptionId: number = -1;
    let vpcPeeringId: number = -1;
    let cloudAccountId: number = -1;
    it('createCloudAccount', async () => {
        const response = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
        cloudAccountId = response['resourceId'];
        console.log(`=== cloudAccountId: ${cloudAccountId} ===`);
        expect(cloudAccountId).not.to.eql(undefined, `The cloud account id`);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, 'active');
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['status']).to.eql('active', 'The cloud account status');
    });
    it('createSubscription', async () => {
        const paymentMethod = (await cloudAPIClient.getPaymentMethods())[0];
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId)
        const createParameters: CreateSubscriptionParameters = {
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
        };
        const createResponse = await cloudAPIClient.createSubscription(createParameters);
        console.log(createResponse);
        subscriptionId = createResponse.resourceId;
        expect(subscriptionId).not.to.eql(undefined, `The subscription id`);
        console.log(`=== SubscriptionId: ${subscriptionId} ===`);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, 'active');
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        console.log(subscription.cloudDetails[0].regions);
        expect(subscription['status']).to.eql('active', 'The subscription status');
    });
    it('getSubscriptions', async () => {
        const subscriptions = await cloudAPIClient.getSubscriptions();
        console.log(subscriptions)
        expect(subscriptions.length).to.eql(1, 'The subscriptions count');
    }); 
    it('getSubscription', async () => {
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        console.log(subscription)
        expect(subscription['id']).to.eql(subscriptionId, 'The subscription id');
    }); 
    it('updateSubscription', async () => {
        const subscriptionName: string = 'updated-subscription';
        await cloudAPIClient.updateSubscription(subscriptionId, {
            name: subscriptionName
        });
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, 'active');
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        console.log(subscription);
        expect(subscription['name']).to.eql(subscriptionName, `The subscription name`);
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        console.log(cidrWhitelists)
        expect(cidrWhitelists.cidr_ips).to.eql([], `The subscription cidr`);
    }); 
    it.skip('updateCidrWhitelists', async () => {
        const updatedCidrIps: string[] = ['192.168.1.2/24'];
        await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, 'active');
        const cidrWhitelists = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        console.log(cidrWhitelists)
        expect(cidrWhitelists.cidr_ips).to.eql(updatedCidrIps, `The subscription cidr`);
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        console.log(subscriptionVpcPeerings)
        expect(subscriptionVpcPeerings.peerings).to.eql([], `The subscription peerings list`);
    }); 
    it.skip('createSubscriptionVpcPeering', async () => {
        const createResponse = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: TEST_ARGUMENTS.VPC_PEERING_AWS_ACCOUNT_ID,
            vpcCidr: TEST_ARGUMENTS.VPC_PEERING_CIDR,
            vpcId: TEST_ARGUMENTS.VPC_PEERING_ID
        });
        vpcPeeringId = createResponse['resourceId'];
        console.log(`=== vpcPeeringId: ${vpcPeeringId} ===`)
        await cloudAPIClient.waitForSubscriptionVpcPeeringStatus(subscriptionId, vpcPeeringId, SubscriptionVpcPeeringStatus.active);
        const subscriptionVpcPeerings = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings.peerings.length).gt(0, 'The subscription peerings list count');
    }); 
    it.skip('deleteSubscriptionVpcPeering', async () => {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering = subscriptionVpcPeerings.peerings.find((vpcPeering: {[key: string]: any}) => vpcPeering['id'] === vpcPeeringId);
        expect(subscriptionVpcPeering).not.to.eql(undefined, 'The subscription peering existence');
    });
  });