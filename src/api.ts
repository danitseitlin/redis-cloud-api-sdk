import Axios, { AxiosInstance } from 'axios';
import { CreateSubscriptionParameters, UpdateSubscriptionParameters, UpdateSubscriptionCidrWhitelistParameters, CreateSubscriptionVpcPeeringParameters } from './interfaces/subscription';
import { CreateDatabaseParameters, UpdateDatabaseParameters, DatabaseImportParameters } from './interfaces/database';
import { CreateCloudAccountParameters, UpdateCloudAccountParameters } from './interfaces/cloud-account';
import { SubscriptionCloudProviderTypes } from './types/subscription';

export class CloudAPISDK {
    private protocol: string = 'https';
    private domain: string = 'api.redislabs.com';
    private version: string = 'v1';
    private accessKey: string
    private secretKey: string
    private httpClient: AxiosInstance

    /**
     * Initializing the constructur with given custom parameters
     * @param parameters The parameters we can pass you customize our sdk client
     */
    constructor(parameters: CloudAPISDKParameters) {
        this.accessKey = parameters.accessKey;
        this.secretKey = parameters.secretKey;
        if (parameters.protocol !== undefined) this.protocol = parameters.protocol;
        if (parameters.domain !== undefined) this.domain = parameters.domain;
        if (parameters.version !== undefined) this.version = parameters.version;
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
     * Returning current account and related information
     */
    async getAccountInformation(): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get('/');
            return response['data']['account'];
        }
        catch(error) {
            return error;
        }
    }
    
    /**
     * Returning a lookup list of database modules supported in current account (support may differ based on subscription and database settings)
     */
    async getDatabaseModules(): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get('/database-modules');
            return response['data']['modules'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning system log information for current account
     * @param limit Maximum number of items to return
     * @param offset Number of items to skip
     */
    async getSystemLogs(limit: number, offset: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/logs?limit=${limit}&offset=${offset}`);
            return response['data']['entries'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of current account’s payment methods
     */
    async getPaymentMethods(): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get('/payment-methods');
            return response['data']['paymentMethods'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of current account's plans
     * @param provider The cloud provider of the plan
     */
    async getPlans(provider: SubscriptionCloudProviderTypes): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/plans?provider=${provider}`);
            return response['data']['plans'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of current account's regions
     * @param provider The cloud provider of the plan
     */
    async getRegions(provider: SubscriptionCloudProviderTypes): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/regions?provider=${provider}`);
            return response['data']['regions'];
        }
        catch(error) {
            return error;
        }
    }

    /* ------------------------------------------------------------------------------Subscription------------------------------------------------------------------------------*/

    /**
     * Returning a lookup list of current account's subscriptions
     */
    async getSubscriptions(): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get('/subscriptions');
            return response['data']['subscriptions'];
        }
        catch(error) {
            return error;
        }
    }
    
    /**
     * Creating a subscription
     * @param createParameters The given parameters given for the subscription creation
     */
    async createSubscription(createParameters: CreateSubscriptionParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.post('/subscriptions', createParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        
        catch(error) {
            return error;
        }
        
    }

    /**
     * Returning a subscription
     * @param subscriptionId The id of the subscription
     */
    async getSubscription(subscriptionId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/subscriptions/${subscriptionId}`);
            return response['data'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Updating a subscription
     * @param subscriptionId The id of the subscription
     * @param updateParameters The given update parameters to update the subscription with
     */
    async updateSubscription(subscriptionId: number, updateParameters: UpdateSubscriptionParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.put(`/subscriptions/${subscriptionId}`, updateParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Deleting a subscription
     * @param subscriptionId The id of the subscription
     */
    async deleteSubscription(subscriptionId: number): Promise<{[key: string]: any}> {
        try {
            const response:any = await this.httpClient.delete(`/subscriptions/${subscriptionId}`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of a subscription CIDR whitelists
     * @param subscriptionId The id of the subscription
     */
    async getSubscriptionCidrWhitelists(subscriptionId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/subscriptions/${subscriptionId}/cidr`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response']['resource'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Updating a subscription CIDR whitelists
     * @param subscriptionId The id of the subscription
     * @param updateParameters The parameters to update the subscription with
     */
    async updateSubscriptionCidrWhitelists(subscriptionId: number, updateParameters: UpdateSubscriptionCidrWhitelistParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.put(`/subscriptions/${subscriptionId}/cidr`, updateParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of the subscription VPC Peerings
     * @param subscriptionId The id of the subscription
     */
    async getSubscriptionVpcPeerings(subscriptionId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/subscriptions/${subscriptionId}/peerings`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response']['resource'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Creating a subscription VPC peering
     * @param subscriptionId The id of the subscription
     * @param createParameters The create parameters to create the VPC peering with
     */
    async createSubscriptionVpcPeering(subscriptionId: number, createParameters: CreateSubscriptionVpcPeeringParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.post(`/subscriptions/${subscriptionId}/peerings`, createParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Deleting a subscription VPC peering
     * @param subscriptionId The id of the subscription
     * @param vpcPeeringId The id of the VPC peering
     */
    async deleteSubscriptionVpcPeering(subscriptionId: number, vpcPeeringId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.delete(`/subscriptions/${subscriptionId}/peerings/${vpcPeeringId}`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /* ---------------------------------------------------------------------------------Database---------------------------------------------------------------------------------*/

    /**
     * Returning a lookup list of databases owned by the account
     * @param subscriptionId The id of the subscription
     */
    async getDatabases(subscriptionId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/subscriptions/${subscriptionId}/databases`);
            return response['data']['subscription'][0]['databases'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Creating a database
     * @param subscriptionId The id of the subscription
     * @param createParameters The create parameters to create the database 
     */
    async createDatabase(subscriptionId: number, createParameters: CreateDatabaseParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases`, createParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }   
    
    /**
     * Returning a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     */
    async getDatabase(subscriptionId: number, databaseId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            return response['data'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Updating a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     * @param updateParameters The update parameters to update the database
     */
    async updateDatabase(subscriptionId: number, databaseId: number, updateParameters: UpdateDatabaseParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.put(`/subscriptions/${subscriptionId}/databases/${databaseId}`, updateParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Deleting a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     */
    async deleteDatabase(subscriptionId: number, databaseId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.delete(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Backing up a database
     * @param subscriptionId The id of the subscription 
     * @param databaseId The id of the database
     */
    async backupDatabase(subscriptionId: number, databaseId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases/${databaseId}/backup`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Importing a dataset into a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     * @param importParameters The import parameters to import into a database
     */
    async importIntoDatabase(subscriptionId: number, databaseId: number, importParameters: DatabaseImportParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases/${databaseId}/import`, importParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /* ------------------------------------------------------------------------------Cloud-Account------------------------------------------------------------------------------*/
    /**
     * Returning a lookup list of cloud accounts owned by the account
     */
    async getCloudAccounts(): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get('/cloud-accounts');
            return response['data']['cloudAccounts'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Creating a cloud account
     * @param createParameters The create parameters to create a cloud account
     */
    async createCloudAccount(createParameters: CreateCloudAccountParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.post('/cloud-accounts', createParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            console.log(error)
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            return error;
        }
    }

    /**
     * Returning a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async getCloudAccount(cloudAccountId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/cloud-accounts/${cloudAccountId}`);
            return response['data'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Updating a cloud account
     * @param cloudAccountId The id of the cloud account
     * @param updateParameters The update parameters to update a cloud account
     */
    async updateCloudAccount(cloudAccountId: number, updateParameters: UpdateCloudAccountParameters): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.put(`/cloud-accounts/${cloudAccountId}`, updateParameters);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Deleting a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async deleteCloudAccount(cloudAccountId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.delete(`/cloud-accounts/${cloudAccountId}`);
            const taskId: number = await response['data']['taskId'];
            const taskResponse: any = await this.waitForTaskStatus(taskId, TaskStatus.completed);
            return taskResponse['response'];
        }
        catch(error) {
            return error;
        }
    }

    /*------------------------------------------------------------------------------Task-------------------------------------------------------------------------------/*
    /**
     * Returning a lookup list of tasks owned by the account
     */
    async getTasks(): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get('/tasks');
            return response['data'];
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a task
     * @param taskId The id of the task
     */
    async getTask(taskId: number): Promise<{[key: string]: any}> {
        try {
            const response: any = await this.httpClient.get(`/tasks/${taskId}`);
            return response['data'];
        }
        catch(error) {
            return error;
        }
    }

    /*--------------------------------------------------------------------------------------Helper--functions-----------------------------------------------------------------------------------*/
    
    /**
     * Waiting for the subscription status to change to a given status
     * @param subscriptionId The id of the subscription
     * @param expectedStatus The expected status
     */
    async waitForSubscriptionStatus(subscriptionId: number, expectedStatus: SubscriptionStatus): Promise<void> { 
        let subscription: any = await this.getSubscription(subscriptionId);
        let subscriptionStatus: SubscriptionStatus = subscription['status'];
        while (subscriptionStatus !== expectedStatus && subscriptionStatus !== SubscriptionStatus.error && subscriptionStatus !== undefined) { 
            await this.sleep(1);
            subscription = await this.getSubscription(subscriptionId);
            subscriptionStatus = await subscription['status'];
        }
    }

    /**
     * Waiting for the subscription VPC peering status to change to a given status
     * @param subscriptionId The id of the subscription
     * @param vpcPeeringId The id of the subscription VPC peering
     * @param expectedStatus The expected status
     */
    async waitForSubscriptionVpcPeeringStatus(subscriptionId: number, vpcPeeringId: number, expectedStatus: string) {
        let subscriptionVpcPeerings = await this.getSubscriptionVpcPeerings(subscriptionId);
        let subscriptionVpcPeering = await subscriptionVpcPeerings['resource']['peerings'].find((vpcPeering: any)=> vpcPeering['id'] === vpcPeeringId)
        let subscriptionVpcPeeringStatus = subscriptionVpcPeering['status'];
        while (subscriptionVpcPeeringStatus !== expectedStatus && subscriptionVpcPeeringStatus !== SubscriptionStatus.error && subscriptionVpcPeeringStatus !== undefined) { 
            await this.sleep(1);
            subscriptionVpcPeerings = await this.getSubscriptionVpcPeerings(subscriptionId);
            subscriptionVpcPeering = await subscriptionVpcPeerings['resource']['peerings'].find((vpcPeering: any)=> vpcPeering['id'] === vpcPeeringId)
            subscriptionVpcPeeringStatus = subscriptionVpcPeering['status'];
        }
    }

    /**
     * Waiting for database status to change to a given status
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     * @param expectedStatus The expected status
     */
    async waitForDatabaseStatus(subscriptionId: number, databaseId: number, expectedStatus: DatabaseStatus): Promise<void> {
        let database: any = await this.getDatabase(subscriptionId, databaseId);
        let databaseStatus: DatabaseStatus = database['status'];
        while (databaseStatus !== expectedStatus && databaseStatus !== DatabaseStatus.error && databaseStatus !== undefined) { 
            await this.sleep(1);
            database = await this.getDatabase(subscriptionId, databaseId);
            databaseStatus = await database['status'];
        }
    }

    /**
     * Waiting for cloud account status to change to a given status
     * @param cloudAccountId The id of the cloud account
     * @param expectedStatus The expected status
     */
    async waitForCloudAccountStatus(cloudAccountId: number, expectedStatus: CloudAccountStatus): Promise<void> {
        let cloudAccount: any = await this.getCloudAccount(cloudAccountId);
        let cloudAccountStatus: CloudAccountStatus = cloudAccount['status'];
        while (cloudAccountStatus !== expectedStatus && cloudAccountStatus !== CloudAccountStatus.error && cloudAccountStatus !== undefined) { 
            await this.sleep(1);
            cloudAccount = await this.getCloudAccount(cloudAccountId);
            cloudAccountStatus = await cloudAccount['status'];
        }
    }

    /**
     * Waiting for task status to change to a given status
     * @param taskId The id of the task
     * @param expectedStatus The expected status
     */
    async waitForTaskStatus(taskId: number, expectedStatus: TaskStatus): Promise<{[key: string]: any}> {
        let task: any = await this.getTask(taskId);
        let taskStatus: TaskStatus = task['status'];
        while (taskStatus !== expectedStatus && taskStatus !== TaskStatus.error && taskStatus !== undefined) { 
            await this.sleep(1);
            task = await this.getTask(taskId);
            taskStatus = await task['status'];
        }
        if (taskStatus === TaskStatus.error) { 
            const errorType: string = task['response']['error']['type'];
            const errorStatus: string = task['response']['error']['status'];
            const errorDescription: string = task['response']['error']['description'];
            console.log(`Task ${taskId} ended up in error: type: ${errorType}, status: ${errorStatus}, description: ${errorDescription}`);
        }
        return task;
    }

    /**
     * Freezing the code for a number of seconds
     * @param seconds seconds to freeze the code
     */
    private async sleep(seconds: number): Promise<{[key: string]: any}> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}

/**
 * The parameters used to initialize the constructor
 * @param accessKey Required. The Cloud API access key
 * @param secretKey Required. The Cloud API secret key
 * @param protocol Optional. The protocol of the API url
 * @param domain Optional. The domain of the API url
 * @param version Optional. The version of the API
 */
export interface CloudAPISDKParameters {
    accessKey: string,
    secretKey: string,
    protocol?: string,
    domain?: string,
    version?: string,
}

/**
 * The available subscription statuses
 * @param active A subscription status indicating the subscription is active
 * @param pending A subscription status indicating the subscription is pending
 * @param deleted A subscription status indicating the subscription is deleted
 * @param error A subscription status indicating the subscription ended up with error
 */
export enum SubscriptionStatus {
    active = 'active',
    pending = 'pending',
    deleted = 404,
    error = 'error'
}

/**
 * The available subscription vpc peering statuses
 * @param active A subscription VPC peering status indicating the subscription VPC peering is active
 * @param inactive A subscription VPC peering status indicating the subscription VPC peering is inactive
 * @param pending A subscription VPC peering status indicating the subscription VPC peering is pending
 * @param error A subscription VPC peering status indicating the subscription VPC peering is error
 */
export enum SubscriptionVpcPeeringStatus {
    active = 'active',
    inactive = 'inactive',
    pending = 'pending-acceptance',
    error = 'failed'
}

/**
 * The available database statuses
 * @param active A database status indicating the database is active
 * @param pending A database status indicating the database is pending
 * @param pendingChange A database status indicating the database is pending a change
 * @param deleted A database status indicating the database is deleted
 * @param error A database status indicating the database ended up with error
 */
export enum DatabaseStatus {
    active = 'active',
    pending = 'draft',
    pendingChange = 'active-change-pending',
    deleted = 404,
    error = 'error'
}

/**
 * The available cloud account statuses
 * @param active A cloud account status indicating the cloud account is active
 * @param pending A cloud account status indicating the cloud account is pending
 * @param pendingChange A cloud account status indicating the cloud account is pending a change
 * @param deleted A cloud account status indicating the cloud account is deleted
 * @param error A cloud account status indicating the cloud account ended up with error
 */
export enum CloudAccountStatus {
    active = 'active',
    pending = 'draft',
    pendingChange = 'change-draft',
    deleted = 404,
    error = 'error'
}

/**
 * The available task statuses
 * @param completed A task status indicating the task is completed
 * @param error A task status indicating the task ended up with error
 */
export enum TaskStatus {
    completed = 'processing-completed',
    error = 'processing-error'
}
