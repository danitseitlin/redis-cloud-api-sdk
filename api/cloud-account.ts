import { TaskResponse } from '../types/task'
import { CloudAccountCreationParameters, CloudAccountUpdateParameters } from '../types/parameters/cloud-account';
import { CloudAccountResponse, CloudAccountStatus } from '../types/responses/cloud-account';
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
        while (cloudAccount !== undefined && cloudAccount.status !== expectedStatus && cloudAccount.status !== 'error' && cloudAccount.status !== undefined && timePassedInSeconds <= timeoutInSeconds) {
            this.client.log('debug', `Waiting for cloud account ${cloudAccountId} status '${cloudAccount.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds}`);
            await this.client.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            cloudAccount = await this.getCloudAccount(cloudAccountId);
        }
        this.client.log('debug', `Cloud account ${cloudAccountId} ended up as '${cloudAccount.status}' status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        return cloudAccount;
    }
}