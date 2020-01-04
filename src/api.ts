import Axios, { AxiosInstance } from 'axios';
import { CreateSubscriptionParameters, UpdateSubscriptionParameters, UpdateSubscriptionCidrWhitelistParameters, CreateSubscriptionVpcPeeringParameters } from './interfaces/subscription';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from './interfaces/database';
import { CreateCloudAccountParameters, UpdateCloudAccountParameters } from './interfaces/cloud-account';

export class CloudAPISDK {
    private protocol: string = 'https';
    private domain: string = 'api.redislabs.com';
    private version: string = 'v1';
    private accessKey: string
    private secretKey: string
    private httpClient: AxiosInstance
    constructor(parameters: CloudAPISDKParameters) {
        this.accessKey = parameters.accessKey;
        this.secretKey = parameters.secretKey;
        if(parameters.protocol !== undefined) this.protocol = parameters.protocol;
        if(parameters.domain !== undefined) this.domain = parameters.domain;
        if(parameters.version !== undefined) this.version = parameters.version;
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
    /**
     * A function that returns current account and related information
     */
    async getAccountInformation() {
        try {
            const response = await this.httpClient.get('/');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }
    
    /**
     * A function that returns a lookup list of database modules supported in current account (support may differ based on subscription and database settings)
     */
    async getDatabaseModules() {
        try {
            const response = await this.httpClient.get('/database-modules');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    /**
     * A function that returns system log information for current account
     */
    async getSystemLogs() {
        try {
            const response = await this.httpClient.get('/logs');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    /**
     * A function that returns a lookup list of current Account’s payment methods
     */
    async getPaymentMethods() {
        try {
            const response = await this.httpClient.get('/payment-methods');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    //Subscription related requests
    async getSubscriptions() {
        try {
            const response = await this.httpClient.get('/subscriptions');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async getSubscription(subscriptionId: number) {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async createSubscription(createParameters: CreateSubscriptionParameters) {
        try {
            const response = await this.httpClient.post('/subscriptions', createParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }


    async updateSubscription(subscriptionId: number, updateParameters: UpdateSubscriptionParameters) {
        try {
            const response = await this.httpClient.put(`/subscriptions/${subscriptionId}`, updateParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async deleteSubscription(subscriptionId: number) {
        try {
            const response = await this.httpClient.delete(`/subscriptions/${subscriptionId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async getSubscriptionCidrWhitelists(subscriptionId: number) {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/cidr`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async updateSubscriptionCidrWhitelists(subscriptionId: number, updateParameters: UpdateSubscriptionCidrWhitelistParameters) {
        try {
            const response = await this.httpClient.put(`/subscriptions/${subscriptionId}/cidr`, updateParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async getSubscriptionVpcPeerings(subscriptionId: number) {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/peerings`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async createSubscriptionVpcPeering(subscriptionId: number, createParameters: CreateSubscriptionVpcPeeringParameters) {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/peerings`, createParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async deleteSubscriptionVpcPeering(subscriptionId: number, vpcPeeringId: number) {
        try {
            const response = await this.httpClient.delete(`/subscriptions/${subscriptionId}/peerings/${vpcPeeringId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    //Databases related requests

    async getDatabases(subscriptionId: number) {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/databases`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async createDatabase(subscriptionId: number, createParameters: CreateDatabaseParameters) {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases`, createParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }   
    
    async getDatabase(subscriptionId: number, databaseId: number) {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async updateDatabase(subscriptionId: number, databaseId: number, updateParameters: UpdateDatabaseParameters) {
        try {
            const response = await this.httpClient.put(`/subscriptions/${subscriptionId}/databases/${databaseId}`, updateParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async deleteDatabase(subscriptionId: number, databaseId: number) {
        try {
            const response = await this.httpClient.delete(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async backupDatabase(subscriptionId: number, databaseId: number) {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async importIntoDatabase(subscriptionId: number, databaseId: number, importParameters: DatabaseImportParameters) {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases/${databaseId}`, importParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    //Cloud accounts related requests
    async getCloudAccounts() {
        try {
            const response = await this.httpClient.get('/cloud-accounts');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async createCloudAccount(createParameters: CreateCloudAccountParameters) {
        try {
            const response = await this.httpClient.post('/cloud-accounts', createParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async getCloudAccount(cloudAccountId: number) {
        try {
            const response = await this.httpClient.get(`/cloud-accounts/${cloudAccountId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async updateCloudAccount(cloudAccountId: number, updateParameters: UpdateCloudAccountParameters) {
        try {
            const response = await this.httpClient.put(`/cloud-accounts/${cloudAccountId}`, updateParameters);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async deleteCloudAccount(cloudAccountId: number) {
        try {
            const response = await this.httpClient.delete(`/cloud-accounts/${cloudAccountId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    //Tasks related requests
    async getTasks() {
        try {
            const response = await this.httpClient.get('/tasks');
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }

    async getTask(taskId: number) {
        try {
            const response = await this.httpClient.get(`/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            if (error && error.response) {
                return error.response.data;
            }
            throw error;
        }
    }
}

export interface CloudAPISDKParameters {
    accessKey: string,
    secretKey: string,
    protocol?: string,
    domain?: string,
    version?: string,
}