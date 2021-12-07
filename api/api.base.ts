import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CloudAPISDKParameters } from '../api';

export class Client {
    /**
     * The protocol of the API. Default: 'https'
     */
    protected protocol = 'https';
    /**
     * The domain of the API. Default: 'api.redislabs.com'
     */
    protected domain = 'api.redislabs.com';
    /**
     * The version of the API. Default: 'v1'
     */
    protected version = 'v1';
    /**
     * If to report debug logs when performing requests. Default: false
     */
    protected debug = false;
    /**
     * The Axios HTTP Client.
     */
    protected httpClient: AxiosInstance
    /**
     * The access key for authentication.
     */
    protected accessKey: string
    /**
     * The secret key for authentication.
     */
    protected secretKey: string

    /**
     * Initializing the API base of the SDK
     * @param parameters The parameters of the SDK
     */
    constructor(parameters: CloudAPISDKParameters) {
        if(parameters.protocol !== undefined) this.protocol = parameters.protocol;
        if(parameters.domain !== undefined) this.domain = parameters.domain;
        if(parameters.version !== undefined) this.version = parameters.version;
        if(parameters.debug !== undefined) this.debug = parameters.debug;
        this.accessKey = parameters.accessKey;
        this.secretKey = parameters.secretKey;
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

    /**
     * Performing a "GET" request
     * @param url The URL of the request
     * @returns An Axios Response
     */
    async get(url: string): Promise<AxiosResponse<any, any>> {
        return await this.httpClient.get(url);
    }

    /**
     * Performing a "POST" request
     * @param url The URL of the request
     * @param body The body of the request
     * @returns An Axios Response
     */
    async post(url: string, body?: any): Promise<AxiosResponse<any, any>> {
        if(body){
            return await this.httpClient.post(url, body);
        }
        return await this.httpClient.post(url);
    }

    /**
     * Performing a "PUT" request
     * @param url The URL of the request
     * @param body The body of the request
     * @returns An Axios Response
     */
    async put(url: string, body?: any): Promise<AxiosResponse<any, any>> {
        if(body){
            return await this.httpClient.put(url, body);
        }
        return await this.httpClient.put(url);
    }

    /**
     * Performing a "DELETE" request
     * @param url The URL of the request
     * @returns An Axios Response
     */
    async delete(url: string): Promise<AxiosResponse<any, any>> {
        return await this.httpClient.delete(url);
    }
}