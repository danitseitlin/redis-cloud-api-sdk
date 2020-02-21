import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../src/api';
import { loadArguments } from './helpers';

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
        expect(Object.keys(accountInformation).length).gte(0, 'Checking the account information json is not empty');
    }); 
    it('getDatabaseModules', async () => {
        const databaseModules: any = await cloudAPIClient.getDatabaseModules();
        expect(databaseModules.length).gte(0, 'Checking if modules key exists');
    });
    it('getSystemLogs', async () => {
        const systemLogs: any = await cloudAPIClient.getSystemLogs(100, 0);
        expect(systemLogs.length).gte(0, 'Checking if enteries key exists');
    }); 
    it('getPaymentMethods', async () => {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        expect(paymentMethods.length).gte(0, 'Checking if paymentMethods key exists');
    });
    it('getPlans', async () => {
        const AWSPlans: any = await cloudAPIClient.getPlans('AWS');
        expect(AWSPlans.length).gte(0, 'Checking if AWS Plans exist');
        const GCPPlans: any = await cloudAPIClient.getPlans('GCP');
        expect(GCPPlans.length).gte(0, 'Checking if GCP Plans exist');
    });
    it('getRegions', async () => {
        const AWSRegions: any = await cloudAPIClient.getRegions('AWS');
        expect(AWSRegions.length).gte(0, 'Checking if AWS regions exist');
        const GCPRegions: any = await cloudAPIClient.getRegions('GCP');
        expect(GCPRegions.length).gte(0, 'Checking if GCP regions exist');
    });
  });