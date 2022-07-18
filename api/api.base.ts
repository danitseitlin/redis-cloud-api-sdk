import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CloudAPISDKParameters } from '../api';

export class Client {
    /**
     * The protocol of the API. Default: 'https'
     */
    public protocol = 'https';
    /**
     * The domain of the API. Default: 'api.redislabs.com'
     */
    public domain = 'api.redislabs.com';
    /**
     * The version of the API. Default: 'v1'
     */
    public version = 'v1';
    /**
     * If to report debug logs when performing requests. Default: false
     */
    public debug = false;
    /**
     * The Axios HTTP Client.
     */
    public httpClient: AxiosInstance
    /**
     * The access key for authentication.
     */
    public accessKey: string
    /**
     * The secret key for authentication.
     */
    public secretKey: string

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
        this.log('debug', `Performing GET request for url '${url}'`);
        const response = await this.httpClient.get(url);
        this.log('debug', `Only data: ${JSON.stringify(response.data)}`)
        return response;
    }

    /**
     * Performing a "POST" request
     * @param url The URL of the request
     * @param body The body of the request
     * @returns An Axios Response
     */
    async post(url: string, body?: any): Promise<AxiosResponse<any, any>> {
        this.log('debug', `Performing POST request for url '${url}'`);
        const response = body ? await this.httpClient.post(url, body): await this.httpClient.post(url);
        this.log('debug', JSON.stringify(response.data))
        return response;
    }

    /**
     * Performing a "PUT" request
     * @param url The URL of the request
     * @param body The body of the request
     * @returns An Axios Response
     */
    async put(url: string, body?: any): Promise<AxiosResponse<any, any>> {
        this.log('debug', `Performing PUT request for url '${url}'`);
        const response = body ? await this.httpClient.put(url, body) : await this.httpClient.put(url);
        this.log('debug', JSON.stringify(response.data))
        return response;
    }

    /**
     * Performing a "DELETE" request
     * @param url The URL of the request
     * @returns An Axios Response
     */
    async delete(url: string, body?: any): Promise<AxiosResponse<any, any>> {
        this.log('debug', `Performing DELETE request for url '${url}'`);
        const response = body ? await this.httpClient.delete(url, { data: body}) : await this.httpClient.delete(url);
        this.log('debug', JSON.stringify(response.data))
        return response;
    }

    /**
     * Log messages depending on log levels
     * @param level The log level
     * @param message The message
     */
    log(level: 'debug', message: string): void {
        if(level === 'debug' && this.debug === true){
            console.debug(`[Cloud API SDK] ${message}`);
        }
    }

    /**
     * Freezing the code for a number of seconds
     * @param seconds seconds to freeze the code
     */
    async sleep(seconds: number): Promise<{[key: string]: any}> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}