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
    this.timeout(60 * 60 * 1000);
    let subscriptionId: number = -1;
    let vpcPeeringId: number = -1;
    let cloudAccountId: number = -1;
    it('createCloudAccount', async () => {
        const response: any = await cloudAPIClient.createCloudAccount(cloudAccountCredentials);
        cloudAccountId = response['resourceId'];
        console.log(`=== cloudAccountId: ${cloudAccountId} ===`);
        expect(cloudAccountId).not.to.eql(undefined, `Cloud account Id`);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.active);
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['status']).to.eql(CloudAccountStatus.active, 'Cloud Account status');
    });
    it('createSubscription', async () => {
        const paymentMethod = (await cloudAPIClient.getPaymentMethods())[0];
        const cloudAccount = await cloudAPIClient.getCloudAccount(cloudAccountId)
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
        subscriptionId = createResponse['resourceId'];
        expect(subscriptionId).not.to.eql(undefined, `Subscription Id`);
        console.log(`=== SubscriptionId: ${subscriptionId} ===`);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['status']).to.eql(SubscriptionStatus.active, 'Subscription status');
    });
    it('getSubscriptions', async () => {
        const subscriptions = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.length).to.eql(1, 'The subscriptions count');
    }); 
    it('getSubscription', async () => {
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['id']).to.eql(subscriptionId, 'The subscription id');
    }); 
    it('updateSubscription', async () => {
        const subscriptionName: string = 'updated-subscription';
        await cloudAPIClient.updateSubscription(subscriptionId, {
            name: subscriptionName
        });
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['name']).to.eql(subscriptionName, `Subscription name was not updated: still ${subscription['name']}`);
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        expect(cidrWhitelists['error']).to.eql(undefined, `Error was found ${cidrWhitelists['error']}`);
    }); 
    it('updateCidrWhitelists', async () => {
        const updatedCidrIps: string[] = ['192.168.1.0/24', '192.168.1.2/24'];
        const response = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        console.log(response);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const cidrWhitelists = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        console.log(cidrWhitelists)
        expect(cidrWhitelists.cidr_ips).to.eql(updatedCidrIps, `Subscription CIDR Whitelists`);
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings.peerings).to.eql([], `Peerings list`);
    }); 
    it.skip('createSubscriptionVpcPeering', async () => {
        const createResponse: any = await cloudAPIClient.createSubscriptionVpcPeering(subscriptionId, {
            region: 'us-east-1',
            awsAccountId: TEST_ARGUMENTS.VPC_PEERING_AWS_ACCOUNT_ID,
            vpcCidr: TEST_ARGUMENTS.VPC_PEERING_CIDR,
            vpcId: TEST_ARGUMENTS.VPC_PEERING_ID
        });
        vpcPeeringId = createResponse['resourceId'];
        console.log(`=== vpcPeeringId: ${vpcPeeringId} ===`)
        await cloudAPIClient.waitForSubscriptionVpcPeeringStatus(subscriptionId, vpcPeeringId, SubscriptionVpcPeeringStatus.active);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        expect(subscriptionVpcPeerings.length).gt(0, 'Subscription VPC Peering was not created!');
    }); 
    it.skip('deleteSubscriptionVpcPeering', async () => {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings['resource']['peerings'].find((vpcPeering: any) => vpcPeering['id'] === vpcPeeringId);
        expect(subscriptionVpcPeering['error']).to.eql(undefined, 'Subscription vpc peering was not removed');
    });
  });