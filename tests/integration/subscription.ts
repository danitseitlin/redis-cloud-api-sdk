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
        expect(cloudAccountId).not.to.eql(undefined, `Cloud account id is ${cloudAccountId}`);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.active);
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        console.log(`============ Cloud account (${cloudAccountId}) ============`);
        console.log(cloudAccount);
        console.log(`===========================================================\n`);
        expect(cloudAccount['status']).to.eql(CloudAccountStatus.active, 'Cloud Account status');
    });
    it('createSubscription', async () => {
        const paymentMethod: any = (await cloudAPIClient.getPaymentMethods())[0];
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId)
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
        console.log(`=== SubscriptionId: ${subscriptionId} ===`);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        console.log(`Created subscription with id: ${subscriptionId}`);
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        console.log(subscription)
        expect(subscription['status']).to.eql(SubscriptionStatus.active, 'The subscription status');
    });
    it('getSubscriptions', async () => {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        expect(subscriptions.length).to.eql(1, 'The subscriptions count');
    }); 
    it('getSubscription', async () => {
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
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
        console.log(cidrWhitelists)
        expect(cidrWhitelists['error']).to.eql(undefined, `Error was found ${cidrWhitelists['error']}`);
    }); 
    it('updateCidrWhitelists', async () => {
        const updatedCidrIps: string[] = ['192.168.20.0/24'];
        await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        expect(cidrWhitelists).to.eql(updatedCidrIps, `Subscription CIDR Whitelists we're not updated: still ${cidrWhitelists}`);
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        console.log(subscriptionVpcPeerings)
        expect(subscriptionVpcPeerings['error']).to.eql(undefined, `Error was found ${subscriptionVpcPeerings['error']}`);
    }); 
    it('createSubscriptionVpcPeering', async () => {
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
    it('deleteSubscriptionVpcPeering', async () => {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings['resource']['peerings'].find((vpcPeering: any) => vpcPeering['id'] === vpcPeeringId);
        expect(subscriptionVpcPeering['error']).to.eql(undefined, 'Subscription vpc peering was not removed');
    });
    // it('deleteSubscription', async () => {
    //     let subscription = await cloudAPIClient.getSubscription(subscriptionId);
    //     const databases = await cloudAPIClient.getDatabases(subscriptionId);
    //     console.log(`Database count: ${databases.length}`)
    //     if(subscription['status'] !== SubscriptionStatus.error) {
    //         for(let i = 0; i < databases.length; i++) {
    //             const databaseId: number = databases[i]['databaseId'];
    //             console.log(`Deleting ${databaseId}...`)
    //             await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
    //             await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
    //             await cloudAPIClient.getDatabase(subscriptionId, databaseId);
    //         }
    //     }
    //     await cloudAPIClient.deleteSubscription(subscriptionId);
    //     await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.deleted);
    //     subscription = await cloudAPIClient.getSubscription(subscriptionId);
    //     console.log(subscription)
    //     // const error: any = subscription.find((error: any) => error['status'] !== undefined);  
    //     // expect(error['status']).to.eql('Not Found', 'Subscription was not removed');
    // });
    // it('deleteCloudAccount', async () => {
    //     await cloudAPIClient.deleteCloudAccount(cloudAccountId);
    //     await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.deleted);
    //     const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
    //     expect(cloudAccount['response']['data']['status']).to.eql(CloudAccountStatus.deleted, 'Cloud account status')
    // });
  });