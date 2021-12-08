import { TaskResponse } from '../types/task'
import { CloudAccountCreationParameters, CloudAccountUpdateParameters } from '../types/parameters/cloud-account';
import { CloudAccountResponse } from '../types/responses/cloud-account';
import { Task } from './task'
import { Client } from './api.base';

export class CloudAccount {
    private task: Task
    constructor(protected client: Client) {
        this.task = new Task(client)
    }

    /**
     * Returning a lookup list of cloud accounts owned by the account
     */
    async getCloudAccounts(): Promise<CloudAccountResponse[] & {[key: string]: any}> {
        try {
            const response = await this.client.get('/cloud-accounts');
            return response.data.cloudAccounts;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Creating a cloud account
     * @param createParameters The create parameters to create a cloud account
     */
    async createCloudAccount(createParameters: CloudAccountCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.post('/cloud-accounts', createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async getCloudAccount(cloudAccountId: number): Promise<CloudAccountResponse & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/cloud-accounts/${cloudAccountId}`);
            return response.data;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Updating a cloud account
     * @param cloudAccountId The id of the cloud account
     * @param updateParameters The update parameters to update a cloud account
     */
    async updateCloudAccount(cloudAccountId: number, updateParameters: CloudAccountUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.put(`/cloud-accounts/${cloudAccountId}`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Deleting a cloud account
     * @param cloudAccountId The id of the cloud account
     */
    async deleteCloudAccount(cloudAccountId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.delete(`/cloud-accounts/${cloudAccountId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }
}