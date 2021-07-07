import Axios, { AxiosInstance } from 'axios';
import { CreateSubscriptionParameters, SubscriptionUpdateParameters, CidrUpdateParameters, VpcPeeringCreationParameters } from './types/parameters/subscription';
import { DatabaseImportParameters, DatabaseCreationParameters, DatabaseUpdateParameters } from './types/parameters/database';
import { CloudAccountCreationParameters, CloudAccountUpdateParameters } from './types/parameters/cloud-account';
import { SubscriptionCloudProvider, Subscription, SubscriptionCidrWhitelist, SubscriptionStatus, SubscriptionVpcPeering, SubscriptionVpcPeeringStatus } from './types/responses/subscription';
import { AccountInformation, DatabaseModule, SystemLog, PaymentMethod, Plan, Region, DataPersistence } from './types/responses/general';
import { CloudAccount, CloudAccountStatus } from './types/responses/cloud-account';
import { Task, TaskResponse, TaskStatus } from './types/task';
import { Database, DatabaseStatus } from './types/responses/database';

export class CloudAPISDK {
    private protocol: string = 'https';
    private domain: string = 'api.redislabs.com';
    private version: string = 'v1';
    private debug: boolean = false;
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
        if(parameters.protocol !== undefined) this.protocol = parameters.protocol;
        if(parameters.domain !== undefined) this.domain = parameters.domain;
        if(parameters.version !== undefined) this.version = parameters.version;
        if(parameters.debug !== undefined) this.debug = parameters.debug;
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
    async getAccountInformation(): Promise<AccountInformation & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/');
            return response.data.account;
        }
        catch(error) {
            return error;
        }
    }
    
    /**
     * Returning a lookup list of data persistence values
     */
    async getDataPersistences(): Promise<DataPersistence[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/data-persistence');
            return response.data.dataPersistence;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of database modules supported in current account (support may differ based on subscription and database settings)
     */
    async getDatabaseModules(): Promise<DatabaseModule[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/database-modules');
            return response.data.modules;
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
    async getSystemLogs(limit: number, offset: number): Promise<SystemLog[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/logs?limit=${limit}&offset=${offset}`);
            return response.data.entries;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of current account’s payment methods
     */
    async getPaymentMethods(): Promise<PaymentMethod[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/payment-methods');
            return response.data.paymentMethods;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of current account's plans
     * @param provider The cloud provider of the plan
     */
    async getPlans(provider: SubscriptionCloudProvider): Promise<Plan[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/plans?provider=${provider}`);
            return response.data.plans;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of current account's regions
     * @param provider The cloud provider of the plan
     */
    async getRegions(provider: SubscriptionCloudProvider): Promise<Region[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/regions?provider=${provider}`);
            return response.data.regions;
        }
        catch(error) {
            return error;
        }
    }

    /* ------------------------------------------------------------------------------Subscription------------------------------------------------------------------------------*/

    /**
     * Returning a lookup list of current account's subscriptions
     */
    async getSubscriptions(): Promise<Subscription[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/subscriptions');
            return response.data.subscriptions;
        }
        catch(error) {
            return error;
        }
    }
    
    /**
     * Creating a subscription
     * @param createParameters The given parameters given for the subscription creation
     */
    async createSubscription(createParameters: CreateSubscriptionParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.post('/subscriptions', createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a subscription
     * @param subscriptionId The id of the subscription
     */
    async getSubscription(subscriptionId: number): Promise<Subscription & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}`);
            return response.data;
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
    async updateSubscription(subscriptionId: number, updateParameters: SubscriptionUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.put(`/subscriptions/${subscriptionId}`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Deleting a subscription
     * @param subscriptionId The id of the subscription
     */
    async deleteSubscription(subscriptionId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.delete(`/subscriptions/${subscriptionId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of a subscription CIDR whitelists
     * @param subscriptionId The id of the subscription
     */
    async getSubscriptionCidrWhitelist(subscriptionId: number): Promise<SubscriptionCidrWhitelist & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/cidr`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response.resource;
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
    async updateSubscriptionCidrWhitelists(subscriptionId: number, updateParameters: CidrUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.put(`/subscriptions/${subscriptionId}/cidr`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a lookup list of the subscription VPC Peerings
     * @param subscriptionId The id of the subscription
     */
    async getVpcPeerings(subscriptionId: number): Promise<SubscriptionVpcPeering[]> {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/peerings`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response.resource.peerings;
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
    async createSubscriptionVpcPeering(subscriptionId: number, createParameters: VpcPeeringCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/peerings`, createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
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
    async deleteSubscriptionVpcPeering(subscriptionId: number, vpcPeeringId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.delete(`/subscriptions/${subscriptionId}/peerings/${vpcPeeringId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
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
    async getDatabases(subscriptionId: number): Promise<Database[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/databases`);
            return response.data.subscription[0].databases;
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
    async createDatabase(subscriptionId: number, createParameters: DatabaseCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases`, createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
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
    async getDatabase(subscriptionId: number, databaseId: number): Promise<Database & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            return response.data;
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
    async updateDatabase(subscriptionId: number, databaseId: number, updateParameters: DatabaseUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.put(`/subscriptions/${subscriptionId}/databases/${databaseId}`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
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
    async deleteDatabase(subscriptionId: number, databaseId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.delete(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
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
    async backupDatabase(subscriptionId: number, databaseId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases/${databaseId}/backup`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
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
    async importIntoDatabase(subscriptionId: number, databaseId: number, importParameters: DatabaseImportParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.post(`/subscriptions/${subscriptionId}/databases/${databaseId}/import`, importParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /* ------------------------------------------------------------------------------Cloud-Account------------------------------------------------------------------------------*/
    /**
     * Returning a lookup list of cloud accounts owned by the account
     */
    async getCloudAccounts(): Promise<CloudAccount[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/cloud-accounts');
            return response.data.cloudAccounts;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Creating a cloud account
     * @param createParameters The create parameters to create a cloud account
     */
    async createCloudAccount(createParameters: CloudAccountCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.post('/cloud-accounts', createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async getCloudAccount(cloudAccountId: number): Promise<CloudAccount & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/cloud-accounts/${cloudAccountId}`);
            return response.data;
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
    async updateCloudAccount(cloudAccountId: number, updateParameters: CloudAccountUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.put(`/cloud-accounts/${cloudAccountId}`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Deleting a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async deleteCloudAccount(cloudAccountId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.httpClient.delete(`/cloud-accounts/${cloudAccountId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error;
        }
    }

    /*------------------------------------------------------------------------------Task-------------------------------------------------------------------------------/*
    /**
     * Returning a lookup list of tasks owned by the account
     */
    async getTasks(): Promise<Task[] & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get('/tasks');
            return response.data;
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Returning a task
     * @param taskId The id of the task
     */
    async getTask(taskId: number): Promise<Task & {[key: string]: any}> {
        try {
            const response = await this.httpClient.get(`/tasks/${taskId}`);
            return response.data;
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
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 20 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForSubscriptionStatus(subscriptionId: number, expectedStatus: SubscriptionStatus, timeoutInSeconds = 20 * 60, sleepTimeInSeconds = 5) {
        let subscription = await this.getSubscription(subscriptionId);
        let timePassedInSeconds = 0;
        while (subscription.status !== expectedStatus && subscription.status !== 'error' && subscription.status !== undefined && timePassedInSeconds <= timeoutInSeconds) {
            this.log('debug', `Waiting for subscription ${subscription.id} status '${subscription.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds})`)
            await this.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            subscription = await this.getSubscription(subscriptionId);
        }
        this.log('debug', `Subscription ${subscription.id} ended up as '${subscription.status}' status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        return subscription;
    }

    /**
     * Waiting for the subscription VPC peering status to change to a given status
     * @param subscriptionId The id of the subscription
     * @param vpcPeeringId The id of the subscription VPC peering
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 5 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForVpcPeeringStatus(subscriptionId: number, vpcPeeringId: number, expectedStatus: SubscriptionVpcPeeringStatus, timeoutInSeconds = 5 * 60, sleepTimeInSeconds = 5){
        let vpcPeerings = await this.getVpcPeerings(subscriptionId);
        let vpcPeering = vpcPeerings.find((vpcPeering: SubscriptionVpcPeering)=> vpcPeering.id === vpcPeeringId)
        let timePassedInSeconds = 0;
        if(vpcPeering !== undefined) {
            let status = vpcPeering.status;
            while (status !== expectedStatus && status !== 'failed' && status !== undefined && timePassedInSeconds <= timeoutInSeconds) {
                this.log('debug', `Waiting for VPC peering ${vpcPeeringId} status '${status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds}`)
                await this.sleep(sleepTimeInSeconds);
                timePassedInSeconds+=sleepTimeInSeconds;
                vpcPeerings = await this.getVpcPeerings(subscriptionId);
                vpcPeering = vpcPeerings.find((vpcPeering: SubscriptionVpcPeering)=> vpcPeering.id === vpcPeeringId)
                if(vpcPeering !== undefined) status = vpcPeering.status;
            }
        }
        this.log('debug', `VPC peering ${vpcPeeringId} ended up as '${status}' status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        return vpcPeering;
    }

    /**
     * Waiting for database status to change to a given status
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 5 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForDatabaseStatus(subscriptionId: number, databaseId: number, expectedStatus: DatabaseStatus, timeoutInSeconds = 5 * 60, sleepTimeInSeconds = 5) {
        let database = await this.getDatabase(subscriptionId, databaseId);
        let timePassedInSeconds = 0;
        while (database.status !== expectedStatus && database.status !== 'error' && database.status !== undefined && timePassedInSeconds <= timeoutInSeconds) { 
            this.log('debug', `Waiting for database ${databaseId} status '${database.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds} (Subscription ${subscriptionId})`);
            await this.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            database = await this.getDatabase(subscriptionId, databaseId);
        }
        this.log('debug', `Database ${databaseId} ended up as '${database.status}' status after ${timePassedInSeconds}/${timeoutInSeconds} (Subscription ${subscriptionId})`);
        return database;
    }
    /**
     * Waiting for all databases status under subscription to change to the expected status
     * @param subscriptionId The id of the subscription
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 5 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForSubscriptionDatabasesStatus(subscriptionId: number, expectedStatus: DatabaseStatus = 'active', timeoutInSeconds = 5 * 60, sleepTimeInSeconds = 5) {
        let databases = await this.getDatabases(subscriptionId);
        for (let database of databases){
            this.waitForDatabaseStatus(subscriptionId, database.databaseId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds)
        }
    }
    
    /**
     * Waiting for cloud account status to change to a given status
     * @param cloudAccountId The id of the cloud account
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 5 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForCloudAccountStatus(cloudAccountId: number, expectedStatus: CloudAccountStatus, timeoutInSeconds = 5 * 60, sleepTimeInSeconds = 5) {
        let cloudAccount = await this.getCloudAccount(cloudAccountId);
        let timePassedInSeconds = 0;
        while (cloudAccount.status !== expectedStatus && cloudAccount.status !== 'error' && cloudAccount.status !== undefined && timePassedInSeconds <= timeoutInSeconds) {
            this.log('debug', `Waiting for cloud account ${cloudAccountId} status '${cloudAccount.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds}`);
            await this.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            cloudAccount = await this.getCloudAccount(cloudAccountId);
        }
        this.log('debug', `Cloud account ${cloudAccountId} ended up as '${cloudAccount.status}' status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        return cloudAccount;
    }

    /**
     * Waiting for task status to change to a given status
     * @param taskId The id of the task
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 20 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForTaskStatus(taskId: number, expectedStatus: TaskStatus, timeoutInSeconds = 20 * 60, sleepTimeInSeconds = 5): Promise<Task & {[key: string]: any}> {
        let task = await this.getTask(taskId);
        let timePassedInSeconds = 0;
        while (task.status !== expectedStatus && task.status !== 'processing-error' && task.status !== undefined && timePassedInSeconds <= timeoutInSeconds) { 
            this.log('debug', `Waiting for task ${taskId} status '${task.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds}`);
            await this.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            task = await this.getTask(taskId);
        }
        this.log('debug', `Task ${taskId} ended up as ${task.status} status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        if(task.status === 'processing-error' && task.response.error !== undefined) { 
            const errorType = task.response.error.type;
            const errorStatus = task.response.error.status;
            const errorDescription = task.response.error.description;
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

    /**
     * Log messages depending on log levels
     * @param level The log level
     * @param message The message
     */
    private log(level: 'debug', message: string): void {
        if(level === 'debug' && this.debug)
            console.log(message);
    }
}

/**
 * The parameters used to initialize the constructor
 * @param accessKey Required. The Cloud API access key
 * @param secretKey Required. The Cloud API secret key
 * @param protocol Optional. The protocol of the API url
 * @param domain Optional. The domain of the API url
 * @param version Optional. The version of the API
 * @param debug Optional. Ability to show extra debug logs
 */
export interface CloudAPISDKParameters {
    accessKey: string,
    secretKey: string,
    protocol?: string,
    domain?: string,
    version?: string,
    debug?: boolean
}

type Error = {
    config: {
        url: string,
        method: string,
        headers: {[key: string]: any},
        baseURL: string,
        [key: string]: any
    },
    request: {[key: string]: any},
    response: {
        status: string | number,
        statusText: string,
        headers: {[key: string]: any},
        config: {
            url: string,
            method: string,
            headers: {[key: string]: any},
            baseURL: string,
            [key: string]: any
        },
        request: {[key: string]: any},
        data: string,
        [key: string]: any
    },
    [key: string]: any
}