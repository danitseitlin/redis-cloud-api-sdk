import { expect } from 'chai';
import { CloudAPISDK } from '../../src/api';
import { loadArguments } from '../helpers';
import { MockServer } from 'dmock-server';

const testArguments = loadArguments();
const mock = require('../mockers/general.json');
const server = new MockServer({
    hostname: testArguments.ENVIRONMENT,
    port: parseInt(testArguments.PORT),
    routes: mock.routes
});

const cloudAPIClient = new CloudAPISDK({
    protocol: 'http',
    domain: `${testArguments.ENVIRONMENT}:${testArguments.PORT}`,
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
});
describe('Testing general functions', async function() {
    this.timeout(10 * 60 * 60);
    before(async () => {
        server.start();
    });

    after(async () => {
        server.stop();
    });
    it('getAccountInformation', async () => {
        const accountInformation = await cloudAPIClient.getAccountInformation();
        expect(accountInformation.key.accountId).to.eql(123, 'Account id');
    }); 
    it('getDataPersistences', async () => {
        const dataPersistenceList = await cloudAPIClient.getDataPersistences();
        expect(dataPersistenceList.length).to.eql(6, 'Data persistences count')
    });
    it('getDatabaseModules', async () => {
        const databaseModules = await cloudAPIClient.getDatabaseModules();
        expect(databaseModules.length).to.eql(1, 'Database modules count')
    });
    it('getSystemLogs', async () => {
        const systemLogs = await cloudAPIClient.getSystemLogs(2, 0);
        expect(systemLogs.length).to.eql(1, 'System logs count')
    }); 
    it('getPaymentMethods', async () => {
        const paymentMethods = await cloudAPIClient.getPaymentMethods();
        expect(paymentMethods.length).to.eql(1, 'Payment methods count');
    });
    it('getPlans', async () => { 
        const plans = await cloudAPIClient.getPlans('AWS');
        expect(plans.length).to.eql(1, 'Plans count');
    });
    it('getRegions', async () => {
        const regions = await cloudAPIClient.getRegions('AWS');
        expect(regions.length).to.eql(1, 'Regions count');
    });
});