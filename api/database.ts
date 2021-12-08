import { DatabaseCreationParameters, DatabaseImportParameters, DatabaseUpdateParameters } from '../types/parameters/database';
import { DatabaseResponse, DatabaseStatus } from '../types/responses/database';
import { TaskResponse } from '../types/task';
import { Client } from './api.base';
import { Task } from './task';

export class Database {
    private task: Task
    constructor(protected client: Client) {
        this.task = new Task(client)
    }
    /**
     * Returning a lookup list of databases owned by the account
     * @param subscriptionId The id of the subscription
     */
     async getDatabases(subscriptionId: number): Promise<DatabaseResponse[] & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/subscriptions/${subscriptionId}/databases`);
            return response.data.subscription[0].databases;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Creating a database
     * @param subscriptionId The id of the subscription
     * @param createParameters The create parameters to create the database 
     */
    async createDatabase(subscriptionId: number, createParameters: DatabaseCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.post(`/subscriptions/${subscriptionId}/databases`, createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }   
    
    /**
     * Returning a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     */
    async getDatabase(subscriptionId: number, databaseId: number): Promise<DatabaseResponse & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            return response.data;
        }
        catch(error) {
            return error as any;
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
            const response = await this.client.put(`/subscriptions/${subscriptionId}/databases/${databaseId}`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Deleting a database
     * @param subscriptionId The id of the subscription
     * @param databaseId The id of the database
     */
    async deleteDatabase(subscriptionId: number, databaseId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.delete(`/subscriptions/${subscriptionId}/databases/${databaseId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Backing up a database
     * @param subscriptionId The id of the subscription 
     * @param databaseId The id of the database
     */
    async backupDatabase(subscriptionId: number, databaseId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.post(`/subscriptions/${subscriptionId}/databases/${databaseId}/backup`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
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
            const response = await this.client.post(`/subscriptions/${subscriptionId}/databases/${databaseId}/import`, importParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
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
            this.client.log('debug', `Waiting for database ${databaseId} status '${database.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds} (Subscription ${subscriptionId})`);
            await this.client.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            database = await this.getDatabase(subscriptionId, databaseId);
        }
        this.client.log('debug', `Database ${databaseId} ended up as '${database.status}' status after ${timePassedInSeconds}/${timeoutInSeconds} (Subscription ${subscriptionId})`);
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
        for (const database of databases){
            await this.waitForDatabaseStatus(subscriptionId, database.databaseId, expectedStatus, timeoutInSeconds, sleepTimeInSeconds)
        }
    }
}