import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../api';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing general', async function() {
    it('getAccountInformation', async function() {
        const accountInformation: any = await cloudAPIClient.getAccountInformation();
        expect(accountInformation['account']).not.to.eql(undefined, 'Checking if account key exists');
    }); 
    it('getDatabaseModules', async function() {
        const databaseModules: any = await cloudAPIClient.getDatabaseModules();
        expect(databaseModules['modules']).not.to.eql(undefined, 'Checking if modules key exists');
    });
    it('getSystemLogs', async function() {
        const systemLogs: any = await cloudAPIClient.getSystemLogs(100, 0);
        expect(systemLogs['enteries']).not.to.eql(undefined, 'Checking if enteries key exists');
    }); 
    it('getPaymentMethods', async function() {
        const paymentMethods: any = await cloudAPIClient.getPaymentMethods();
        expect(paymentMethods['paymentMethods']).not.to.eql(undefined, 'Checking if paymentMethods key exists');
    });
    it('getPlans', async function() {
        const paymentMethods: any = await cloudAPIClient.getPlans('AWS');
        expect(paymentMethods['plans']).not.to.eql(undefined, 'Checking if plans key exists');
    });
    it('getRegions', async function() {
        const paymentMethods: any = await cloudAPIClient.getRegions('AWS');
        expect(paymentMethods['regions']).not.to.eql(undefined, 'Checking if regions key exists');
    });
  });