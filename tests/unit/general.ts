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
    this.timeout(10 * 60);
    it('getAccountInformation', async () => {
        const accountInformation: any = await cloudAPIClient.getAccountInformation();
        expect(accountInformation.message).to.eql(undefined, 'Error message existence');
        expect(accountInformation.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getDatabaseModules', async () => {
        const databaseModules: any = await cloudAPIClient.getDatabaseModules();
        expect(databaseModules.message).to.eql(undefined, 'Error message existence');
        expect(databaseModules.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getSystemLogs', async () => {
        const systemLogs: any = await cloudAPIClient.getSystemLogs(2, 0);
        expect(systemLogs.message).to.eql(undefined, 'Error message existence');
        expect(systemLogs.message).not.to.eql('Request failed with status code 404', 'Error message type');
    }); 
    it('getPaymentMethods', async () => {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        expect(paymentMethods.message).to.eql(undefined, 'Error message existence');
        expect(paymentMethods.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getPlans', async () => { 
        const AWSPlans: any = await cloudAPIClient.getPlans('AWS');
        expect(AWSPlans.message).to.eql(undefined, 'Error message existence');
        expect(AWSPlans.message).not.to.eql('Request failed with status code 404', 'Error message type');
        const GCPPlans: any = await cloudAPIClient.getPlans('GCP');
        expect(GCPPlans.message).to.eql(undefined, 'Error message existence');
        expect(GCPPlans.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
    it('getRegions', async () => {
        const AWSRegions: any = await cloudAPIClient.getRegions('AWS');
        expect(AWSRegions.message).to.eql(undefined, 'Error message existence');
        expect(AWSRegions.message).not.to.eql('Request failed with status code 404', 'Error message type');
        const GCPRegions: any = await cloudAPIClient.getRegions('GCP');
        expect(GCPRegions.message).to.eql(undefined, 'Error message existence');
        expect(GCPRegions.message).not.to.eql('Request failed with status code 404', 'Error message type');
    });
});