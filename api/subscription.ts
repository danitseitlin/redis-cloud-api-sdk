import { AxiosInstance } from "axios";
import { CidrUpdateParameters, CreateSubscriptionParameters, SubscriptionUpdateParameters, VpcPeeringCreationParameters } from "../types/parameters/subscription";
import { SubscriptionCidrWhitelist, SubscriptionVpcPeering } from "../types/responses/subscription";
import { TaskResponse } from '../types/task';
import { Task } from '../api/task';

export class Subscription {
    private task: Task
    constructor(protected client: AxiosInstance, private debug = false) {
        this.task = new Task(this.client, this.debug)
    }
    
    /**
    * Returning a lookup list of current account's subscriptions
    */
    async getSubscriptions(): Promise<Subscription[] & {[key: string]: any}> {
        try {
            const response: any = await this.client.get('/subscriptions');
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
            const response: any = await this.client.post('/subscriptions', createParameters);
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
    async getSubscription(subscriptionId: number): Promise<Subscription & {[key: string]: any}> {
        try {
            const response: any = await this.client.get(`/subscriptions/${subscriptionId}`);
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
            const response: any = await this.client.put(`/subscriptions/${subscriptionId}`, updateParameters);
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
            const response: any = await this.client.delete(`/subscriptions/${subscriptionId}`);
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
            const response: any = await this.client.get(`/subscriptions/${subscriptionId}/cidr`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response.resource;
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
            const response: any = await this.client.put(`/subscriptions/${subscriptionId}/cidr`, updateParameters);
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
            const response: any = await this.client.get(`/subscriptions/${subscriptionId}/peerings`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response.resource.peerings;
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
            const response: any = await this.client.post(`/subscriptions/${subscriptionId}/peerings`, createParameters);
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
            const response: any = await this.client.delete(`/subscriptions/${subscriptionId}/peerings/${vpcPeeringId}`);
            const taskId: number = response.data.taskId;
            const taskResponse = await this.task.waitForTaskStatus(taskId, 'processing-completed');
            return taskResponse.response;
        }
        catch(error) {
            return error as any;
        }
    }
}
