import {
    CreateSubscriptionParameters, SubscriptionUpdateParameters, CidrUpdateParameters, VpcPeeringCreationParameters
} from './types/parameters/subscription';
import {
    DatabaseImportParameters, DatabaseCreationParameters, DatabaseUpdateParameters
} from './types/parameters/database';
import {
    CloudAccountCreationParameters, CloudAccountUpdateParameters
} from './types/parameters/cloud-account';
import {
    SubscriptionCloudProvider, SubscriptionCidrWhitelist, SubscriptionStatus, SubscriptionVpcPeering,
    SubscriptionVpcPeeringStatus, SubscriptionResponse
} from './types/responses/subscription';
import {
    AccountInformation, DatabaseModuleInformation, SystemLog, PaymentMethod, Plan, Region, DataPersistence
} from './types/responses/general';
import {
    CloudAccountResponse, CloudAccountStatus
} from './types/responses/cloud-account';
import {
    TaskObject,
    TaskResponse, TaskStatus
} from './types/task';
import { DatabaseResponse, DatabaseStatus } from './types/responses/database';
import { General } from './api/general';
import { Subscription } from './api/subscription'
import { Task } from './api/task';
import { Database } from './api/database';
import { CloudAccount } from './api/cloud-account';
import { Client } from './api/api.base';

export class CloudAPISDK extends Client {
    private general: General
    private subscription: Subscription
    private database: Database
    private cloudAccount: CloudAccount
    private task: Task

    /**
     * Initializing the constructur with given custom parameters
     * @param parameters The parameters we can pass you customize our sdk client
     */
    constructor(parameters: CloudAPISDKParameters) {
        super(parameters);
        this.general = new General(this);
        this.subscription = new Subscription(this);
        this.database = new Database(this);
        this.cloudAccount = new CloudAccount(this);
        this.task = new Task(this);
    }

    /**
     * Returning current account and related information
     */
    async getAccountInformation(): Promise<AccountInformation & {[key: string]: any}> {
        return await this.general.getAccountInformation();
    }
    
    /**
     * Returning a lookup list of data persistence values
     */
    async getDataPersistences(): Promise<DataPersistence[] & {[key: string]: any}> {
        return await this.general.getDataPersistences();
    }

    /**
     * Returning a lookup list of database modules supported in current account (support may differ based on subscription and database settings)
     */
    async getDatabaseModules(): Promise<DatabaseModuleInformation[] & {[key: string]: any}> {
        return await this.general.getDatabaseModules();
    }

    /**
     * Returning system log information for current account
     * @param limit Maximum number of items to return
     * @param offset Number of items to skip
     */
    async getSystemLogs(limit: number, offset: number): Promise<SystemLog[] & {[key: string]: any}> {
        return await this.general.getSystemLogs(limit, offset);
    }

    /**
     * Returning a lookup list of current account’s payment methods
     */
    async getPaymentMethods(): Promise<PaymentMethod[] & {[key: string]: any}> {
        return await this.general.getPaymentMethods();
    }

    /**
     * Returning a lookup list of current account's plans
     * @param provider The cloud provider of the plan
     */
    async getPlans(provider: SubscriptionCloudProvider): Promise<Plan[] & {[key: string]: any}> {
        return await this.general.getPlans(provider);
    }

    /**
     * Returning a lookup list of current account's regions
     * @param provider The cloud provider of the plan
     */
    async getRegions(provider: SubscriptionCloudProvider): Promise<Region[] & {[key: string]: any}> {
        return await this.general.getRegions(provider);
    }

    /* ------------------------------------------------------------------------------Subscription------------------------------------------------------------------------------*/

    /**
     * Returning a lookup list of current account's subscriptions
     */
    async getSubscriptions(): Promise<SubscriptionResponse[] & {[key: string]: any}> {
        return await this.subscription.getSubscriptions();
    }
    
    /**
     * Creating a subscription
     * @param createParameters The given parameters given for the subscription creation
     */
    async createSubscription(createParameters: CreateSubscriptionParameters): Promise<TaskResponse & {[key: string]: any}> {
        return await this.subscription.createSubscription(createParameters);
    }

    /**
     * Returning a subscription
     * @param subscriptionId The id of the subscription
     */
    async getSubscription(subscriptionId: number): Promise<SubscriptionResponse & {[key: string]: any}> {
        return await this.subscription.getSubscription(subscriptionId)
    }

    /**
     * Updating a subscription
     * @param subscriptionId The id of the subscription
     * @param updateParameters The given update parameters to update the subscription with
     */
    async updateSubscription(subscriptionId: number, updateParameters: SubscriptionUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        return await this.subscription.updateSubscription(subscriptionId, updateParameters)
    }

    /**
     * Deleting a subscription
     * @param subscriptionId The id of the subscription
     */
    async deleteSubscription(subscriptionId: number): Promise<TaskResponse & {[key: string]: any}> {
        return await this.subscription.deleteSubscription(subscriptionId)
    }

    /**
     * Returning a lookup list of a subscription CIDR whitelists
     * @param subscriptionId The id of the subscription
     */
    async getSubscriptionCidrWhitelist(subscriptionId: number): Promise<SubscriptionCidrWhitelist & {[key: string]: any}> {
        return await this.subscription.getSubscriptionCidrWhitelist(subscriptionId)
    }

    /**
     * Updating a subscription CIDR whitelists
     * @param subscriptionId The id of the subscription
     * @param updateParameters The parameters to update the subscription with
     */
    async updateSubscriptionCidrWhitelists(subscriptionId: number, updateParameters: CidrUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        return await this.subscription.updateSubscriptionCidrWhitelists(subscriptionId, updateParameters)
    }

    /**
     * Returning a lookup list of the subscription VPC Peerings
     * @param subscriptionId The id of the subscription
     */
    async getVpcPeerings(subscriptionId: number): Promise<SubscriptionVpcPeering[]> {
        return await this.subscription.getVpcPeerings(subscriptionId)
    }

    /**
     * Creating a subscription VPC peering
     * @param subscriptionId The id of the subscription
     * @param createParameters The create parameters to create the VPC peering with
     */
    async createSubscriptionVpcPeering(subscriptionId: number, createParameters: VpcPeeringCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        return await this.subscription.createSubscriptionVpcPeering(subscriptionId, createParameters)
    }

    /**
     * Deleting a subscription VPC peering
     * @param subscriptionId The id of the subscription
     * @param vpcPeeringId The id of the VPC peering
     */
    async deleteSubscriptionVpcPeering(subscriptionId: number, vpcPeeringId: number): Promise<TaskResponse & {[key: string]: any}> {
        return await this.subscription.deleteSubscriptionVpcPeering(subscriptionId, vpcPeeringId)
    }

    /* ---------------------------------------------------------------------------------Database---------------------------------------------------------------------------------*/

    /**
     * Returning a lookup list of databases owned by the account
     * @param subscriptionId The id of the subscription
     */
    async getDatabases(subscriptionId: number): Promise<DatabaseResponse[] & {[key: string]: any}> {
        return await this.database.getDatabases(subscriptionId);
    }

    /**
     * Creating a database
     * @param subscriptionId The id of the subscription
     * @param createParameters The create parameters to create the database 
     */
    async createDatabase(subscriptionId: number, createParameters: DatabaseCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        return this.database.createDatabase(subscriptionId, createParameters);
    }   
    
    /**
     * Returning a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     */
    async getDatabase(subscriptionId: number, databaseId: number): Promise<DatabaseResponse & {[key: string]: any}> {
        return this.database.getDatabase(subscriptionId, databaseId);
    }

    /**
     * Updating a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     * @param updateParameters The update parameters to update the database
     */
    async updateDatabase(subscriptionId: number, databaseId: number, updateParameters: DatabaseUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        return this.database.updateDatabase(subscriptionId, databaseId, updateParameters);
    }

    /**
     * Deleting a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     */
    async deleteDatabase(subscriptionId: number, databaseId: number): Promise<TaskResponse & {[key: string]: any}> {
        return this.database.deleteDatabase(subscriptionId, databaseId);
    }

    /**
     * Backing up a database
     * @param subscriptionId The id of the subscription 
     * @param databaseId The id of the database
     */
    async backupDatabase(subscriptionId: number, databaseId: number): Promise<TaskResponse & {[key: string]: any}> {
        return this.database.backupDatabase(subscriptionId, databaseId);
    }

    /**
     * Importing a dataset into a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     * @param importParameters The import parameters to import into a database
     */
    async importIntoDatabase(subscriptionId: number, databaseId: number, importParameters: DatabaseImportParameters): Promise<TaskResponse & {[key: string]: any}> {
        return this.database.importIntoDatabase(subscriptionId, databaseId, importParameters);
    }

    /* ------------------------------------------------------------------------------Cloud-Account------------------------------------------------------------------------------*/
    /**
     * Returning a lookup list of cloud accounts owned by the account
     */
    async getCloudAccounts(): Promise<CloudAccountResponse[] & {[key: string]: any}> {
        return await this.cloudAccount.getCloudAccounts();
    }

    /**
     * Returning a cloud account
     * @param cloudAccountId The id of the cloud account
     */
     async getCloudAccount(cloudAccountId: number): Promise<CloudAccountResponse & {[key: string]: any}> {
        return await this.cloudAccount.getCloudAccount(cloudAccountId);
    }

    /**
     * Creating a cloud account
     * @param createParameters The create parameters to create a cloud account
     */
    async createCloudAccount(createParameters: CloudAccountCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        return await this.cloudAccount.createCloudAccount(createParameters);
    }

    /**
     * Updating a cloud account
     * @param cloudAccountId The id of the cloud account
     * @param updateParameters The update parameters to update a cloud account
     */
    async updateCloudAccount(cloudAccountId: number, updateParameters: CloudAccountUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        return await this.cloudAccount.updateCloudAccount(cloudAccountId, updateParameters);
    }

    /**
     * Deleting a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async deleteCloudAccount(cloudAccountId: number): Promise<TaskResponse & {[key: string]: any}> {
        return await this.cloudAccount.deleteCloudAccount(cloudAccountId);
    }

    /*------------------------------------------------------------------------------Task-------------------------------------------------------------------------------/*
    /**
     * Returning a lookup list of tasks owned by the account
     */
    async getTasks(): Promise<TaskObject[] & {[key: string]: any}> {
        return await this.task.getTasks()
    }

    /**
     * Returning a task
     * @param taskId The id of the task
     */
    async getTask(taskId: number): Promise<TaskObject & {[key: string]: any}> {
        return await this.task.getTask(taskId)
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
        return await this.subscription.waitForSubscriptionStatus(subscriptionId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
    }

    /**
     * Waiting for existing subscriptions statuses to change to a given status
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 20 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds 
     * @returns A batch of subscription responses
     */
    async waitForSubscriptionsStatus(expectedStatus: SubscriptionStatus, timeoutInSeconds = 20 * 60, sleepTimeInSeconds = 5) {
        return await this.subscription.waitForSubscriptionsStatus(expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
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
        return await this.subscription.waitForVpcPeeringStatus(subscriptionId, vpcPeeringId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
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
        return await this.database.waitForDatabaseStatus(subscriptionId, databaseId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
    }
    
    /**
     * Waiting for all databases status under subscription to change to the expected status
     * @param subscriptionId The id of the subscription
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 5 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForSubscriptionDatabasesStatus(subscriptionId: number, expectedStatus: DatabaseStatus = 'active', timeoutInSeconds = 5 * 60, sleepTimeInSeconds = 5) {
        return await this.database.waitForSubscriptionDatabasesStatus(subscriptionId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds)
    }
    
    /**
     * Waiting for cloud account status to change to a given status
     * @param cloudAccountId The id of the cloud account
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 5 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForCloudAccountStatus(cloudAccountId: number, expectedStatus: CloudAccountStatus, timeoutInSeconds = 5 * 60, sleepTimeInSeconds = 5) {
        return await this.cloudAccount.waitForCloudAccountStatus(cloudAccountId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
    }

    /**
     * Waiting for task status to change to a given status
     * @param taskId The id of the task
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 20 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds
     */
    async waitForTaskStatus(taskId: number, expectedStatus: TaskStatus, timeoutInSeconds = 20 * 60, sleepTimeInSeconds = 5): Promise<TaskObject & {[key: string]: any}> {
        return await this.task.waitForTaskStatus(taskId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
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