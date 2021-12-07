import { TaskStatus } from '../types/task';
import { Client } from './api.base';

export class Task {
    constructor(protected client: Client) {}

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
            this.client.log('debug', `Waiting for task ${taskId} status '${task.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds}`);
            await this.client.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            task = await this.getTask(taskId);
        }
        this.client.log('debug', `Task ${taskId} ended up as ${task.status} status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        if(task.status === 'processing-error' && task.response.error !== undefined) { 
            const errorType = task.response.error.type;
            const errorStatus = task.response.error.status;
            const errorDescription = task.response.error.description;
            console.log(`Task ${taskId} ended up in error: type: ${errorType}, status: ${errorStatus}, description: ${errorDescription}`);
        }
        return task;
    }

    /**
     * Returning a lookup list of tasks owned by the account
     */
    async getTasks(): Promise<Task[] & {[key: string]: any}> {
        try {
            const response = await this.client.get('/tasks');
            return response.data;
        }
        catch(error) {
            return error as any;
        }
    }
    
    /**
     * Returning a task
     * @param taskId The id of the task
     */
    async getTask(taskId: number): Promise<Task & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/tasks/${taskId}`);
            return response.data;
        }
        catch(error) {
            return error as any;
        }
    }
}
