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
    this.timeout(10 * 60 * 1000);
    it('getAccountInformation', async () => {
        const accountInformation = await cloudAPIClient.getAccountInformation();
        expect(accountInformation['id']).not.to.eql(undefined, 'Account id');
    }); 
    it('getDatabaseModules', async () => {
        const databaseModules = await cloudAPIClient.getDatabaseModules();
        expect(databaseModules.length).gte(4, 'Database modules count');
    });
    it('getSystemLogs', async () => {
        const systemLogs = await cloudAPIClient.getSystemLogs(2, 0);
        expect(systemLogs.length).gte(0, 'System logs count');
    }); 
    it('getPaymentMethods', async () => {
        const paymentMethods = await cloudAPIClient.getPaymentMethods();
        expect(paymentMethods.length).gte(0, 'Payment methods count');
    });
    it('getPlans', async () => {
        const AWSPlans = await cloudAPIClient.getPlans('AWS');
        expect(AWSPlans.length).gte(0, 'AWS plans count');
        const GCPPlans = await cloudAPIClient.getPlans('GCP');
        expect(GCPPlans.length).gte(0, 'GCP plans count');
    });
    it('getRegions', async () => {
        const AWSRegions = await cloudAPIClient.getRegions('AWS');
        expect(AWSRegions.length).gte(0, 'AWS regions count');
        const GCPRegions = await cloudAPIClient.getRegions('GCP');
        expect(GCPRegions.length).gte(0, 'GCP regions count');
    });
});