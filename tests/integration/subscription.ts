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
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        const paymentMethod: any = paymentMethods[0];
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
        // if(TEST_ARGUMENTS.DEBUG) console.log(createResponse);
        expect(createResponse['error']).to.eql(undefined, `Error was found ${createResponse['error']}`);
        subscriptionId = createResponse['resourceId'];
        console.log(`=== ${subscriptionId} ===`);
        // if(TEST_ARGUMENTS.DEBUG) console.log(`Created subscription with id: ${subscriptionId}`);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const subscription = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['status']).eql(SubscriptionStatus.active, `Expected status ${SubscriptionStatus.active} but got ${subscription['status']}`);
    });
    it('getSubscriptions', async () => {
        const subscriptions: any = await cloudAPIClient.getSubscriptions();
        const subscription: any = subscriptions.find((subscription: any) => subscription['id'] === subscriptionId);
        expect(subscription['id']).to.eql(subscriptionId, `Error was found ${subscription['error']}`);
    }); 
    it('getSubscription', async () => {
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['id']).to.eql(subscriptionId, `Error was found ${subscription['error']}`);
    }); 
    it('updateSubscription', async () => {
        const subscriptionName: string = 'updated-subscription';
        const updateResponse: any = await cloudAPIClient.updateSubscription(subscriptionId, {
            name: subscriptionName
        });
        if(TEST_ARGUMENTS.DEBUG) console.log(updateResponse);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const subscription: any = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['name']).to.eql(subscriptionName, `Subscription name was not updated: still ${subscription['name']}`);
    }); 
    it('getCidrWhitelists', async () => {
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        if(TEST_ARGUMENTS.DEBUG) console.log(cidrWhitelists);
        expect(cidrWhitelists['error']).to.eql(undefined, `Error was found ${cidrWhitelists['error']}`);
    }); 
    it('updateCidrWhitelists', async () => {
        const updatedCidrIps: string[] = ['192.168.20.0/24'];
        const updateResponse: any = await cloudAPIClient.updateSubscriptionCidrWhitelists(subscriptionId, {
            cidrIps: updatedCidrIps
        });
        if(TEST_ARGUMENTS.DEBUG) console.log(updateResponse);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        const cidrWhitelists: any = await cloudAPIClient.getSubscriptionCidrWhitelists(subscriptionId);
        if(TEST_ARGUMENTS.DEBUG) console.log(updatedCidrIps);
        expect(cidrWhitelists).to.eql(updatedCidrIps, `Subscription CIDR Whitelists we're not updated: still ${cidrWhitelists}`);
    }); 
    it('getSubscriptionVpcPeerings', async () => {
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        if(TEST_ARGUMENTS.DEBUG) console.log(subscriptionVpcPeerings)
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
        await cloudAPIClient.waitForSubscriptionVpcPeeringStatus(subscriptionId, vpcPeeringId, SubscriptionVpcPeeringStatus.active);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        if(TEST_ARGUMENTS.DEBUG) console.log(subscriptionVpcPeerings)
        expect(subscriptionVpcPeerings.length).gt(0, 'Subscription VPC Peering was not created!');
    }); 
    it('deleteSubscriptionVpcPeering', async () => {
        await cloudAPIClient.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId);
        const subscriptionVpcPeerings: any = await cloudAPIClient.getSubscriptionVpcPeerings(subscriptionId);
        const subscriptionVpcPeering: any = subscriptionVpcPeerings['resource']['peerings'].find((vpcPeering: any) => vpcPeering['id'] === vpcPeeringId);
        if(TEST_ARGUMENTS.DEBUG) console.log(subscriptionVpcPeering);
        expect(subscriptionVpcPeering['error']).to.eql(undefined, 'Subscription vpc peering was not removed');
    });
    it('deleteSubscription', async () => {
        const databases = await cloudAPIClient.getDatabases(subscriptionId);
        for(let i = 0; i < databases.length; i++) {
            const databaseId: number = databases[i]['databaseId'];
            await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.active);
            expect(databases[i]['status']).eql(DatabaseStatus.active);
            const deleteDatabaseResponse: any = await cloudAPIClient.deleteDatabase(subscriptionId, databaseId);
            if(TEST_ARGUMENTS.DEBUG) console.log(deleteDatabaseResponse);
            await cloudAPIClient.waitForDatabaseStatus(subscriptionId, databaseId, DatabaseStatus.deleted);
            // const database = await cloudAPIClient.getDatabase(subscriptionId, databaseId);
            // if(TEST_ARGUMENTS.DEBUG) console.log(database);
            // const error: any = database.find((error: any) => error['status'] !== undefined);  
            // if(TEST_ARGUMENTS.DEBUG) console.log(error);
            // expect(error['status']).to.eql('Not Found', 'Checking that the database was deleted');
        }
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.active);
        let subscription = await cloudAPIClient.getSubscription(subscriptionId);
        expect(subscription['status']).eql(SubscriptionStatus.active);
        const deleteSubscriptionResponse: any = await cloudAPIClient.deleteSubscription(subscriptionId);
        if(TEST_ARGUMENTS.DEBUG) console.log(deleteSubscriptionResponse);
        await cloudAPIClient.waitForSubscriptionStatus(subscriptionId, SubscriptionStatus.deleted);
        subscription = await cloudAPIClient.getSubscription(subscriptionId);
        const error: any = subscription.find((error: any) => error['status'] !== undefined);  
        if(TEST_ARGUMENTS.DEBUG) console.log(error);
        expect(error['status']).to.eql('Not Found', 'Subscription was not removed');
    });
    it('deleteCloudAccount', async () => {
        await cloudAPIClient.deleteCloudAccount(cloudAccountId);
        await cloudAPIClient.waitForCloudAccountStatus(cloudAccountId, CloudAccountStatus.deleted);
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccountId);
        expect(cloudAccount['response']['data']['status']).eql(CloudAccountStatus.deleted, 'Cloud account status')
    });
  });