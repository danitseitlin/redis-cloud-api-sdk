import { DatabaseCreationParameters, DatabaseImportParameters, DatabaseUpdateParameters } from '../types/parameters/database';
import { DatabaseResponse } from '../types/responses/database';
import { TaskResponse } from '../types/task';
import { Client } from './api.base';
import { Task } from './task';

export class Database {
    private task: Task
    constructor(protected client: Client, private debug = false) {
        this.task = new Task(client, this.debug)
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
}