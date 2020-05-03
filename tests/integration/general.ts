import { expect } from 'chai';
import { CloudAPISDK } from '../../src/api';
import { loadArguments } from '../helpers';
import Axios from 'axios';

const testArguments = loadArguments();

const cloudAPIClient = new CloudAPISDK({
    accessKey: testArguments.API_ACCESS_KEY,
    secretKey: testArguments.API_SECRET_KEY,
    domain: testArguments.ENVIRONMENT
});
describe('Testing general', async function() {
    this.timeout(10 * 60 * 1000);
    it('Verifying no new paths are existing', async () => {
        const axios = Axios.create({
            baseURL: `https://${testArguments.ENVIRONMENT}/v1`,
            responseType: 'json'
        })
        const response = await axios.get('/v2/api-docs?group=Redis Labs Cloud API - Version 1');
        const paths = Object.keys(response.data.paths);
        expect(paths.length).to.eql(20, 'Paths count');
    }); 
    it('getAccountInformation', async () => {
        const accountInformation = await cloudAPIClient.getAccountInformation();
        expect(accountInformation.id).not.to.eql(undefined, 'Account id');
    }); 
    it('getDataPersistences', async () => {
        const dataPersistenceList = await cloudAPIClient.getDataPersistences();
        expect(dataPersistenceList.length).to.eql(6, 'Data persistences count')
    }); 
    it('getDatabaseModules', async () => {
        const databaseModules = await cloudAPIClient.getDatabaseModules();
        expect(databaseModules.length).gte(0, 'Database modules count');
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