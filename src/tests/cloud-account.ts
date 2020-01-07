import { expect } from 'chai';
import { CloudAPISDK } from '../api';
const cloudAPIClient: CloudAPISDK = new CloudAPISDK({accessKey: '', secretKey: ''});
describe('Testing cloud account', async function() {
    it('getCloudAccounts', async function() {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0);
    }); 
    it('getCloudAccount', async function() {
        const cloudAccounts: any = await cloudAPIClient.getCloudAccounts();
        expect(cloudAccounts.length).gt(0, 'Expecting to have more than 1 cloud account');
        const cloudAccount: any = await cloudAPIClient.getCloudAccount(cloudAccounts.find((element: { [x: string]: number; }) => element['id'] != 1).id);
        // expect(cloudAccount).not();
    }); 
  });