import { AxiosInstance } from "axios";
import { SubscriptionCloudProvider } from "..";
import { AccountInformation, DataPersistence, DatabaseModule, SystemLog, PaymentMethod, Plan, Region } from "../types/responses/general";

export class General {
    constructor(protected client: AxiosInstance) { }
    async getAccountInformation(): Promise<AccountInformation & {[key: string]: any}> {
        try {
            const response = await this.client.get('/');
            return response.data.account;
        }
        catch(error) {
            return error as any;
        }
    }
    
    /**
     * Returning a lookup list of data persistence values
     */
    async getDataPersistences(): Promise<DataPersistence[] & {[key: string]: any}> {
        try {
            const response = await this.client.get('/data-persistence');
            return response.data.dataPersistence;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a lookup list of database modules supported in current account (support may differ based on subscription and database settings)
     */
    async getDatabaseModules(): Promise<DatabaseModule[] & {[key: string]: any}> {
        try {
            const response = await this.client.get('/database-modules');
            return response.data.modules;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning system log information for current account
     * @param limit Maximum number of items to return
     * @param offset Number of items to skip
     */
    async getSystemLogs(limit: number, offset: number): Promise<SystemLog[] & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/logs?limit=${limit}&offset=${offset}`);
            return response.data.entries;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a lookup list of current account’s payment methods
     */
    async getPaymentMethods(): Promise<PaymentMethod[] & {[key: string]: any}> {
        try {
            const response = await this.client.get('/payment-methods');
            return response.data.paymentMethods;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a lookup list of current account's plans
     * @param provider The cloud provider of the plan
     */
    async getPlans(provider: SubscriptionCloudProvider): Promise<Plan[] & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/plans?provider=${provider}`);
            return response.data.plans;
        }
        catch(error) {
            return error as any;
        }
    }

    /**
     * Returning a lookup list of current account's regions
     * @param provider The cloud provider of the plan
     */
    async getRegions(provider: SubscriptionCloudProvider): Promise<Region[] & {[key: string]: any}> {
        try {
            const response = await this.client.get(`/regions?provider=${provider}`);
            return response.data.regions;
        }
        catch(error) {
            return error as any;
        }
    }
}