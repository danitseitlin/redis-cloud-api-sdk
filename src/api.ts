import Axios, { AxiosInstance } from 'axios';
import { createSubscriptionParameters, updateSubscriptionParameters, updateSubscriptionCidrWhitelistParameters, createSubscriptionVpcPeeringParameters } from './interfaces/subscription';

export class CloudAPISDK {
    private protocol: string
    private domain: string
    private version: string
    private accessKey: string
    private secretKey: string
    private httpClient: AxiosInstance
    constructor(apiAccessKey: string, apiSecretKey: string) {
        this.accessKey = apiAccessKey;
        this.secretKey = apiSecretKey;
        this.protocol = 'https';
        this.domain = 'api.redislabs.com';
        this.version = 'v1';
        this.httpClient = Axios.create({
            baseURL: `${this.protocol}://${this.domain}/${this.version}`,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.accessKey,
                'x-api-secret-key': this.secretKey
            }
        })
    }

    //Account related requests
    async getAccountInformation() {
        try {
            const response = await this.httpClient.get('/');
            return response.data;
        } catch (err) {
            if (err && err.response) {
                return err.response.data;
            }
            throw err;
        }
    }
    
    async getDatabaseAvailableModules() {

    }

    async getSystemLogs() {

    }

    //Subscription related requests
    async getSubscriptions() {

    }

    async getSubscription(subscriptionId: number) {

    }

    async createSubscription(createParameters: createSubscriptionParameters) {

    }


    async updateSubscription(subscriptionId: number, updateParameters: updateSubscriptionParameters) {

    }

    async deleteSubscription(subscriptionId: number) {

    }

    async getSubscriptionCidrWhitelists(subscriptionId: number) {

    }

    async updateSubscriptionCidrWhitelists(subscriptionId: number, updateParameters: updateSubscriptionCidrWhitelistParameters) {

    }

    async getSubscriptionVpcPeerings(subscriptionId: number) {

    }

    async createSubscriptionVpcPeering(subscriptionId: number, createParameters: createSubscriptionVpcPeeringParameters) {

    }

    async deleteSubscriptionVpcPeering(subscriptionId: number, vpcPeeringId: number) {

    }

    //Databases related requests

    async getDatabases() {

    }

    async createDatabase() {

    }   
    
    async getDatabase() {

    }

    async updateDatabase() {

    }

    async deleteDatabase() {

    }

    async backupDatabase() {
        
    }

    async importIntoDatabase() {

    }

    //Cloud accounts related requests
    async getCloudAccounts() {

    }

    async createCloudAccount() {

    }

    async getCloudAccount() {
        
    }

    async updateCloudAccount() {

    }

    async deleteCloudAccount() {

    }

    //Tasks related requests
    async getTasks() {}

    async getTask() {}
}

