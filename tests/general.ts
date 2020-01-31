import { expect } from 'chai';
import { CloudAPISDK, CloudAPISDKParameters } from '../src/api';
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key'
}
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
describe('Testing general functions', async function() {
    this.timeout(1000 * 60 * 60);
    it('getAccountInformation', async () => {
        const accountInformation: any = await cloudAPIClient.getAccountInformation();
        expect(accountInformation).not.to.eql(undefined, 'Checking the account information json is not empty');
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
        const plans: any = await cloudAPIClient.getPlans('AWS');
        expect(plans.length).gte(0, 'Checking if plans key exists');
    });
    it('getRegions', async () => {
        const regions: any = await cloudAPIClient.getRegions('AWS');
        expect(regions.length).gte(0, 'Checking if regions key exists');
    });
  });