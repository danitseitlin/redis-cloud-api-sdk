import { expect } from 'chai';
import { CloudAPISDK } from '../../api';
import { cliArguments } from 'cli-argument-parser';
import { MockServer } from 'dmock-server';
import { DatabaseParser } from '../../ooo/parser/database.parser';

/*const server = new MockServer({
    hostname: cliArguments.ENVIRONMENT,
    port: parseInt(cliArguments.PORT),
    routes: 'tests/mockers/cloud-account.json'
});*/

/*const client = new CloudAPISDK({
    protocol: 'http',
    domain: `${cliArguments.ENVIRONMENT}:${cliArguments.PORT}`,
    accessKey: cliArguments.API_ACCESS_KEY,
    secretKey: cliArguments.API_SECRET_KEY,
    debug: true
});*/

describe('Testing Database OOP parser', async function() {
    this.timeout(10 * 60 * 60);
    const cloudAccountId = 1;
    /*before(async () => {
        server.start();
    });
    after(async () => {
        server.stop();
    });*/
    it('Testing default values of OOP object', async () => {
        const db = new DatabaseParser();
    });
   /* it('getCloudAccounts', async () => {
        const cloudAccounts = await client.getCloudAccounts();
        expect(cloudAccounts.length).to.eql(1, 'Cloud accounts count');
    })
    it('getCloudAccount', async () => {
        const cloudAccount = await client.getCloudAccount(cloudAccountId);
        expect(cloudAccount.id).to.eql(1, 'Cloud account id');
        expect(cloudAccount.name).to.eql('My cloud account', 'Cloud account name');
    });
    it('deleteCloudAccount', async () => {
        const response = await client.deleteCloudAccount(cloudAccountId);
        expect(response.resourceId).to.eql(1, 'Cloud account id');
    });*/
});
