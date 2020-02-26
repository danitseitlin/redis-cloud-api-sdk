import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../../src/api';
import { loadArguments } from '../helpers';

const TEST_ARGUMENTS = loadArguments();

const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: TEST_ARGUMENTS.API_ACCESS_KEY,
    secretKey: TEST_ARGUMENTS.API_SECRET_KEY,
    domain: TEST_ARGUMENTS.ENVIRONMENT
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing general functions', async function() {
    this.timeout(1000 * 60 * 60);
    it('getAccountInformation', async () => {
        const accountInformation: any = await cloudAPIClient.getAccountInformation();
        console.log('============= Account Information =============');
        console.log(accountInformation);
        console.log('===============================================');
        expect(accountInformation.message).not.to.eql('Request failed with status code 404', 'Account id');
    }); 
    it('getDatabaseModules', async () => {
        const databaseModules: any = await cloudAPIClient.getDatabaseModules();
        console.log('============= Database modules =============');
        console.log(databaseModules);
        console.log('============================================');
        expect(databaseModules.length).gte(4, 'Database modules count');
    });
    it('getSystemLogs', async () => {
        const systemLogs: any = await cloudAPIClient.getSystemLogs(2, 0);
        console.log('============= System logs =============');
        console.log(systemLogs);
        console.log('=======================================');
        expect(systemLogs.length).gte(0, 'System logs count');
    }); 
    it('getPaymentMethods', async () => {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        console.log('============= Payment methods =============');
        console.log(paymentMethods);
        console.log('===========================================');
        expect(paymentMethods.length).gte(0, 'Payment methods count');
    });
    it('getPlans', async () => {
        const AWSPlans: any = await cloudAPIClient.getPlans('AWS');
        expect(AWSPlans.length).gte(0, 'AWS plans count');
        const GCPPlans: any = await cloudAPIClient.getPlans('GCP');
        expect(GCPPlans.length).gte(0, 'GCP plans count');
    });
    it('getRegions', async () => {
        const AWSRegions: any = await cloudAPIClient.getRegions('AWS');
        expect(AWSRegions.length).gte(0, 'AWS regions count');
        const GCPRegions: any = await cloudAPIClient.getRegions('GCP');
        expect(GCPRegions.length).gte(0, 'GCP regions count');
    });
});