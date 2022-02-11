import { 
    CidrUpdateParameters, CreateSubscriptionParameters, SubscriptionUpdateParameters, 
    VpcPeeringCreationParameters 
} from '../types/parameters/subscription';
import { SubscriptionCidrWhitelist, SubscriptionVpcPeering, SubscriptionResponse, SubscriptionStatus, SubscriptionVpcPeeringStatus } from '../types/responses/subscription';
import { TaskResponse } from '../types/task';
import { Task } from '../api/task';
import { Client } from './api.base';

export class Subscription {
    private task: Task
    constructor(protected client: Client) {
        this.task = new Task(client)
    }
    
    /**
    * Returning a lookup list of current account's subscriptions
    */
    async getSubscriptions(): Promise<SubscriptionResponse[] & {[key: string]: any}> {
        try {
            const response = await this.client.get('/subscriptions');
            return response.data.subscriptions;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Creating a subscription
     * @param createParameters The given parameters given for the subscription creation
     */
    async createSubscription(createParameters: CreateSubscriptionParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.post('/subscriptions', createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a subscription
     * @param subscriptionId The id of the subscription
     */
    async getSubscription(subscriptionId: number): Promise<SubscriptionResponse & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/subscriptions/${subscriptionId}`);
            return response.data;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Updating a subscription
     * @param subscriptionId The id of the subscription
     * @param updateParameters The given update parameters to update the subscription with
     */
    async updateSubscription(subscriptionId: number, updateParameters: SubscriptionUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.put(`/subscriptions/${subscriptionId}`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Deleting a subscription
     * @param subscriptionId The id of the subscription
     */
    async deleteSubscription(subscriptionId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.delete(`/subscriptions/${subscriptionId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
    * Returning a lookup list of a subscription CIDR whitelists
    * @param subscriptionId The id of the subscription
    */
    async getSubscriptionCidrWhitelist(subscriptionId: number): Promise<SubscriptionCidrWhitelist & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/subscriptions/${subscriptionId}/cidr`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response.resource as any;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Updating a subscription CIDR whitelists
     * @param subscriptionId The id of the subscription
     * @param updateParameters The parameters to update the subscription with
     */
    async updateSubscriptionCidrWhitelists(subscriptionId: number, updateParameters: CidrUpdateParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.put(`/subscriptions/${subscriptionId}/cidr`, updateParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a lookup list of the subscription VPC Peerings
     * @param subscriptionId The id of the subscription
     */
    async getVpcPeerings(subscriptionId: number): Promise<SubscriptionVpcPeering[]> {
        try {
            const response = await this.client.get(`/subscriptions/${subscriptionId}/peerings`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return (taskResponse.response.resource as any).peerings;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Creating a subscription VPC peering
     * @param subscriptionId The id of the subscription
     * @param createParameters The create parameters to create the VPC peering with
     */
    async createSubscriptionVpcPeering(subscriptionId: number, createParameters: VpcPeeringCreationParameters): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.post(`/subscriptions/${subscriptionId}/peerings`, createParameters);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Deleting a subscription VPC peering
     * @param subscriptionId The id of the subscription
     * @param vpcPeeringId The id of the VPC peering
     */
    async deleteSubscriptionVpcPeering(subscriptionId: number, vpcPeeringId: number): Promise<TaskResponse & {[key: string]: any}> {
        try {
            const response = await this.client.delete(`/subscriptions/${subscriptionId}/peerings/${vpcPeeringId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }

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
            this.client.log('debug', `Waiting for subscription ${subscription.id} status '${subscription.status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds})`)
            await this.client.sleep(sleepTimeInSeconds);
            timePassedInSeconds+=sleepTimeInSeconds;
            subscription = await this.getSubscription(subscriptionId);
        }
        this.client.log('debug', `Subscription ${subscription.id} ended up as '${subscription.status}' status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        return subscription;
    }

    /**
     * Waiting for existing subscriptions statuses to change to a given status
     * @param expectedStatus The expected status
     * @param timeoutInSeconds The timeout of waiting for the status. Default: 20 minutes
     * @param sleepTimeInSeconds The sleep time between requests. Default: 5 seconds 
     * @returns A batch of subscription responses
     */
    async waitForSubscriptionsStatus(expectedStatus: SubscriptionStatus, timeoutInSeconds = 20 * 60, sleepTimeInSeconds = 5) {
        const subscriptions = await this.getSubscriptions();
        const subscriptionResponses: SubscriptionResponse[] = [];
        for(const subscription of subscriptions) {
            const response = await this.waitForSubscriptionStatus(subscription.id, expectedStatus, timeoutInSeconds, sleepTimeInSeconds);
            subscriptionResponses.push(response);
        }
        return subscriptionResponses;
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
                this.client.log('debug', `Waiting for VPC peering ${vpcPeeringId} status '${status}' to be become status '${expectedStatus}' (${timePassedInSeconds}/${timeoutInSeconds}`)
                await this.client.sleep(sleepTimeInSeconds);
                timePassedInSeconds+=sleepTimeInSeconds;
                vpcPeerings = await this.getVpcPeerings(subscriptionId);
                vpcPeering = vpcPeerings.find((vpcPeering: SubscriptionVpcPeering)=> vpcPeering.id === vpcPeeringId)
                if(vpcPeering !== undefined) status = vpcPeering.status;
            }
        }
        this.client.log('debug', `VPC peering ${vpcPeeringId} ended up as '${status}' status after ${timePassedInSeconds}/${timeoutInSeconds}`);
        return vpcPeering;
    }
}
