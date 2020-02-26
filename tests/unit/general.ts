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
        console.log(accountInformation.message);
        console.log('===============================================');
        expect(accountInformation.message).not.to.eql('Request failed with status code 404', 'Error message');
    }); 
    it('getDatabaseModules', async () => {
        const databaseModules: any = await cloudAPIClient.getDatabaseModules();
        console.log('============= Database modules =============');
        console.log(databaseModules.message);
        console.log('============================================');
        expect(databaseModules.message).not.to.eql('Request failed with status code 404', 'Error message');
    });
    it('getSystemLogs', async () => {
        const systemLogs: any = await cloudAPIClient.getSystemLogs(2, 0);
        console.log('============= System logs =============');
        console.log(systemLogs);
        console.log('=======================================');
        expect(systemLogs.message).not.to.eql('Request failed with status code 404', 'Error message');
    }); 
    it('getPaymentMethods', async () => {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        console.log('============= Payment methods =============');
        console.log(paymentMethods);
        console.log('===========================================');
        expect(paymentMethods.message).not.to.eql('Request failed with status code 404', 'Error message');
    });
    it('getPlans', async () => {
        const AWSPlans: any = await cloudAPIClient.getPlans('AWS');
        expect(AWSPlans.message).not.to.eql('Request failed with status code 404', 'Error message');
        const GCPPlans: any = await cloudAPIClient.getPlans('GCP');
        expect(GCPPlans.message).not.to.eql('Request failed with status code 404', 'Error message');
    });
    it('getRegions', async () => {
        const AWSRegions: any = await cloudAPIClient.getRegions('AWS');
        expect(AWSRegions.message).not.to.eql('Request failed with status code 404', 'Error message');
        const GCPRegions: any = await cloudAPIClient.getRegions('GCP');
        expect(GCPRegions.message).not.to.eql('Request failed with status code 404', 'Error message');
    });
});